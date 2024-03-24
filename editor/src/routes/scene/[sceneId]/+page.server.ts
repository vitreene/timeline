import * as db from '$lib/server/db.js';
import type { Actions } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const sceneId = Number(params.sceneId);
	const scene = await db.getScene(sceneId);
	return { scene };
};

export const actions: Actions = {
	transition: async ({ request }) => {
		console.log('transition =>');
		const data = await request.formData();
		console.log(data);
	},
};
