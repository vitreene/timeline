import { json } from '@sveltejs/kit';

import * as db from '$lib/server/db.js';

export async function GET({ request }) {
	console.log('request', request);

	// const response = await request.json();
	// const { sceneId = 1 } = response;

	const sceneId = 1;

	const scene = await db.getScene(sceneId);
	console.log('+scene : ', scene);

	return json({ scene });
	// return json({ response: 'KO' });
}
