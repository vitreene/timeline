import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export async function GET() {
	const capsules = await prisma.capsule.findMany();

	return json(capsules);
}

export const POST: RequestHandler = async ({ request }) => {
	const { type, sceneId } = await request.json();
	const newCapsule = await prisma.capsule.create({
		data: {
			type,
			scene: {
				connect: { id: sceneId },
			},
		},
	});

	return json(newCapsule);
};

export const fallback: RequestHandler = async ({ request }) => {
	// return text(`I caught your ${request.method} request!`);
	const formdata = await request.formData();
	switch (request.method.toUpperCase()) {
		case 'DELETE':
			const id = Number(formdata.get('id'));
			if (!isNaN(id)) await prisma.capsule.delete({ where: { id } });
			break;

		default:
			break;
	}
	return json({ response: 'OK' });
};
