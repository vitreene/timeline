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
		const [action, elementId] = (data.get('action') as string).split('/');
		const name = data.get('text-in-time') as string;
		const duration = 0;
		if (name) {
			db.addEventtoMedia(name, action, duration, Number(elementId));
		}
		console.log(actions);
		console.log(data);
	},
};

/* 
 { name: 'intro', value: 'intro/1' },
editor:dev:editor:     { name: 'text-in-time', value: '3-009-risques' }
*/
