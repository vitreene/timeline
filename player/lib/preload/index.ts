import { PersoMediaStore, SoundNode } from '~/main';
import { getPersoSounds } from './audio';
import { getPersoImages } from './ikono';

export interface OptionalMediasStoreProps {
	audio: Record<string, SoundNode>;
	thr3d: any;
	ikono: any;
	video: any;
}

export async function preload(store: PersoMediaStore): Promise<PersoMediaStore> {
	const st01 = await getPersoSounds(store);
	console.log('LOAD SOUNDS');

	const st02 = await getPersoImages(st01.persos);
	console.log('LOAD IMAGES');

	return { ...st02.persos, ...st01.medias, ...st02.medias };
}
