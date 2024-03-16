import prisma from '$lib/prisma';
import type { Capsule, CapsuleElement, Media } from '@prisma/client';

export interface SceneComp {
	capsules: Array<CapsuleComp>;
}

export interface CapsuleComp extends Capsule {
	elements: Array<ElementComp>;
}

export interface ElementComp extends CapsuleElement {
	media: Media;
}
// SCENE

export async function getScene(sceneId: number) {
	const scene: SceneComp | null = await prisma.scene.findUnique({
		where: { id: sceneId },
		include: {
			capsules: {
				include: {
					elements: {
						include: {
							media: true,
						},
					},
				},
			},
		},
	});
	return scene;
}

// CAPSULE
export async function getCapsules(sceneId: number) {
	return await prisma.capsule.findMany({ where: { sceneId } });
}
export async function createCapsule({ sceneId, type }: { sceneId: number; type: string }) {
	const newCapsule = await prisma.capsule.create({
		data: {
			type,
			scene: {
				connect: { id: sceneId },
			},
		},
	});
	return newCapsule;
}

export async function deleteCapsule(id: number) {
	return await prisma.capsule.delete({ where: { id } });
}
