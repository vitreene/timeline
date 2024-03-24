import * as db from '$lib/server/db.js';

export const load = async ({ params }) => {
	const sceneId = Number(params.sceneId);
	const scene = await db.getScene(sceneId);
	return { scene };
};
