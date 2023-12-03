import { getPersoSounds } from './audio';
import { getPersoImages } from './ikono';
import { getPersoVideos } from './video';
import type { SoundNode, Store } from '~/main';

export interface OptionalMediasStoreProps {
	audio: Record<string, SoundNode>;
	thr3d: any;
	ikono: any;
	video: any;
}

export async function preload(store: Store): Promise<Store> {
	const st01 = await getPersoSounds(store);
	console.log('LOAD SOUNDS');

	const st02 = await getPersoImages(st01.persos);
	console.log('LOAD IMAGES');

	const st03 = await getPersoVideos(st01.persos);
	console.log('LOAD VIDEOS');

	const persos01 = { ...st03.persos, ...st01.medias, ...st02.medias, ...st03.medias };

	const persos = {};

	// self action
	Object.entries(persos01).map(([key, p]) => {
		persos[key] = { ...p, actions: { ...p.actions, [key]: true } };
	});

	return persos;
}
