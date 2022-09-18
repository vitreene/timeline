import { Store } from '../types';
import { getPersoSounds, registerAudio } from './audio';

export async function preload(persos_: Store) {
	const { persoSounds, persos } = getPersoSounds(persos_);
	const audio = await registerAudio(persoSounds);
	console.log('preload', audio);
	Object.values(audio).forEach((sound) => sound.media.mediaElement.play());
	const ikono = {};
	const video = {};
	return Promise.resolve({ persos, audio, ikono, video });
}
