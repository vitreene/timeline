import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import * as db from '$lib/server/db.js';

export async function GET({ request }) {
	const { sceneId } = await request.json();

	const capsules = await db.getCapsules(sceneId);
	return json({ capsules });
}

export const POST: RequestHandler = async ({ request }) => {
	const { type, sceneId } = await request.json();
	const newCapsule = db.createCapsule({ type, sceneId });
	return json(newCapsule);
};

export const fallback: RequestHandler = async ({ request }) => {
	const formdata = await request.formData();
	switch (request.method.toUpperCase()) {
		case 'DELETE':
			const id = Number(formdata.get('id'));
			if (!isNaN(id)) await db.deleteCapsule(id);
			break;

		default:
			break;
	}
	return json({ response: 'OK' });
};
