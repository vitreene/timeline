import * as db from '$lib/server/db.js';
import prisma from '$lib/prisma';

import type { Actions } from '@sveltejs/kit';
import { writeFileSync } from 'fs';

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

	upload: async ({ request }) => {
		const data = await request.formData();
		data.forEach((v, k) => console.log(k, v));

		if (data.has('file')) {
			const files = data.getAll('file') as File[];
			console.log(files);
			for (const file of files) {
				const type = filetype[file.type.split('/')[0] as 'image' | 'audio'];

				const path = `assets/${file.name}`;
				writeFileSync(`static/${path}`, Buffer.from(await file.arrayBuffer()));
				await prisma.media.create({
					data: {
						type,
						path,
					},
				});
			}
			return { success: 'OK' };
		}
	},
};

const filetype = {
	image: 'img',
	audio: 'sound',
};
