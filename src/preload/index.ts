import { Store } from '../types';
import { getPersoSounds, registerAudio } from './audio';

export async function preload(persos_: Store) {
	const { persoSounds, persos } = getPersoSounds(persos_);
	const audio = await registerAudio(persoSounds);
	console.log('preload', audio);
	const ikono = {};
	const video = {};
	const thr3d = {};
	return Promise.resolve({ persos, audio, ikono, video, thr3d });
}
