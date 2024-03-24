import prisma from '$lib/prisma';
import type { Capsule, CapsuleElement, Media, Scene } from '@prisma/client';

export interface SceneDB {
	medias: Array<MediaComp>;
	capsules: Array<CapsuleComp>;
}

export interface MediaComp {
	order: number;
	events: string;
	media: Media;
}
export interface CapsuleComp extends Capsule {
	elements: Array<ElementComp>;
}

export interface ElementComp extends CapsuleElement {
	media: Media;
}
export interface TextTime {
	id: string;
	text: string;
	start: number;
	end: number;
}

export interface SceneMedia extends Omit<Media, 'sceneId'> {
	mediaId: number;
	order: number;
	events: Array<TextTime>;
}

export interface SceneComp extends Scene {
	capsules: Array<CapsuleComp>;
	medias: Array<SceneMedia>;
}
// SCENE

export async function getScene(sceneId: number): Promise<SceneComp> {
	const sceneDB = await prisma.scene.findUnique({
		where: { id: sceneId },
		include: {
			medias: {
				include: { media: true },
			},
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

	const medias = sceneDB!.medias.map((m) => ({
		...m.media,
		id: m.media.id,
		order: m.order,
		mediaId: m.media.id,
		events: JSON.parse(m.events),
	}));
	const capsules = sceneDB?.capsules || [];
	return { ...sceneDB!, capsules, medias };
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
