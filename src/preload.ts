import { PersoElementType, PersoNode, Store } from './types';

type PersoId = PersoNode & { id: string };
type AudioClip = {
	audio: MediaElementAudioSourceNode;
	playing: boolean;
};
type AudioClips = Map<string, AudioClip>;

const audioContext = new AudioContext();

export async function preload(persos_: Store) {
	const { persoSounds, persos } = getPersoSounds(persos_);
	const sounds = await registerAudio(persoSounds);
	console.log('preload', sounds);
	// sounds.forEach((sound) => sound.mediaElement.play());
	return Promise.resolve(persos);
}

function getPersoSounds(persos: Store) {
	const persoOthers: Store = {};
	const persoSounds: PersoId[] = [];
	for (const id in persos) {
		persos[id].type === PersoElementType.SOUND ? persoSounds.push({ ...persos[id], id }) : (persoOthers[id] = persos[id]);
	}
	return { persoSounds, persos: persoOthers };
}

async function registerAudio(persos: PersoId[]) {
	const audios = await Promise.all(
		persos.map(async (perso) => {
			const src = perso.initial?.content as string;
			return loadAudio(perso.id, src, audioContext);
		})
	);
	return new Map(audios);
}

type SampleAudio = [string, MediaElementAudioSourceNode];

async function loadAudio(id: string, filepath: string, audioContext: AudioContext): Promise<SampleAudio> {
	return new Promise((resolve, reject) => {
		const source = new Audio();
		source.oncanplay = () => {
			const sampleSource = audioContext.createMediaElementSource(source);
			sampleSource.connect(audioContext.destination);
			resolve([id, sampleSource]);
		};
		source.onerror = (err) => reject(err);
		source.src = filepath;
	});
}
