import { PersoElementType, PersoNode, PersoStore, SoundNode, SoundStore, Store } from '../types';

type SampleAudio = [string, MediaElementAudioSourceNode];

const audioContext = new AudioContext();

export function getPersoSounds(persos: Store) {
	const persoOthers: PersoStore = {};
	const persoSounds: SoundStore = {};
	for (const id in persos) {
		persos[id].type === PersoElementType.SOUND
			? (persoSounds[id] = persos[id] as SoundNode)
			: (persoOthers[id] = persos[id] as PersoNode);
	}
	return { persoSounds, persos: persoOthers };
}

export async function registerAudio(persos: SoundStore) {
	const audios = [];
	for (const id in persos) {
		const src = persos[id].initial?.src;
		audios.push(loadAudio(id, src, audioContext));
	}
	const loadedAudios: SampleAudio[] = await Promise.all(audios);
	for (const [id, media] of loadedAudios) persos[id].media = media;
	return persos;
}

export async function loadAudio(id: string, filepath: string, audioContext: AudioContext): Promise<SampleAudio> {
	return new Promise((resolve, reject) => {
		const source = new Audio();
		const media = audioContext.createMediaElementSource(source);
		media.connect(audioContext.destination);
		source.oncanplay = () => {
			resolve([id, media]);
		};
		source.onerror = (err) => reject(err);
		source.src = filepath;
	});
}
