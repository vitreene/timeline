import { getPersoSounds, registerAudio } from './audio';
import { getPersoThr3D, registerThr3D } from './thr3d';

import type { PersoStore, SoundStore, Store } from '../types';

export interface StoreProps {
	persos: PersoStore;
}
export interface OptionalMediasStoreProps {
	audio: SoundStore;
	thr3d: any;
	ikono: any;
	video: any;
}

export type MediasStoreProps = StoreProps & Partial<OptionalMediasStoreProps>;

export async function preload(persos: Store) {
	const medias: MediasStoreProps = { persos: undefined };

	const filter01 = getPersoSounds(persos);
	const filter02 = getPersoThr3D(filter01.persos);
	if (has(filter01.persoSounds)) medias.audio = await registerAudio(filter01.persoSounds);
	if (has(filter02.persoThr3D)) medias.thr3d = await registerThr3D(filter02.persoThr3D);
	medias.ikono = {};
	medias.video = {};

	medias.persos = filter02.persos;
	console.log('preload', medias);
	return Promise.resolve(medias);
}

function has(obj: object): boolean {
	return Object.keys(obj).length > 0;
}
