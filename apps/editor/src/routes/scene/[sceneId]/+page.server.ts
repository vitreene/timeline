import * as db from '$lib/server/db.js';
import type { Actions } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const sceneId = Number(params.sceneId);
	const scene = await db.getScene(sceneId);
	return { scene };
};

export const actions: Actions = {
	transition: async ({ request }) => {
		const data = await request.formData();
		const [action, elementId] = (data.get('action') as string).split('/');
		const name = data.get('text-in-time') as string;
		const duration = 0;
		if (name) {
			return db.addEventtoMedia(name, action, duration, Number(elementId));
		}
	},

	'delete-transition': async ({ request }) => {
		console.log('delete-transition');
		const data = await request.formData();
		const [action, elementId] = (data.get('action') as string).split('/');
		return db.removeEventFromMedia(action, Number(elementId));
	},
};
