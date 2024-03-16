import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const _scenes = await fetch('/api/scene', {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	});

	const scenes = await _scenes.json();
	return scenes;
};
