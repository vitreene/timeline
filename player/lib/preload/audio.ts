import { My, PersoSoundDef, Store, PersoType, PersoDef } from '~/main';

const audioContext = new AudioContext();

export async function getPersoSounds(store: Store) {
	const medias = {} as Record<string, PersoSoundDef>;
	const persos = {} as Record<string, PersoDef>;
	for (const id in store) {
		if (store[id].type === PersoType.SOUND) {
			medias[id] = store[id] as PersoSoundDef;
			const src = medias[id].initial?.src;
			const media: MediaElementAudioSourceNode = await loadAudio(src, audioContext);
			medias[id].media = media;
		} else {
			persos[id] = store[id] as PersoDef;
		}
	}
	return { persos, medias };
}

export async function loadAudio(
	filepath: string,
	audioContext: AudioContext
): Promise<MediaElementAudioSourceNode> {
	return new Promise((resolve, reject) => {
		const source = new Audio();
		const media: My = audioContext.createMediaElementSource(source);
		media.my = {
			connect: () => media.connect(audioContext.destination),
			disconnect: () => media.disconnect(),
		};

		source.oncanplay = () => resolve(media);
		source.onerror = (err) => reject(err);
		source.src = filepath;
	});
}
