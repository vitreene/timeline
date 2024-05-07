import { writable } from 'svelte/store';

import type { SceneMedia } from '$lib/server/db';

export const activeCue = writable<string>('');

export function addCuesToVideo(video: HTMLVideoElement, media: SceneMedia) {
	const track = video.addTextTrack('metadata', 'meta', 'fr');
	media.events.forEach((e) => {
		const cue = new VTTCue(e.start, e.end, e.text);
		cue.id = e.id;
		track.addCue(cue);
	});
	const change = onChange(video);
	track.addEventListener('cuechange', change);

	return () => track.removeEventListener('cuechange', change);
}

const onChange = (video: HTMLVideoElement) => (event: any) => {
	//

	console.log('CUE |-->', event?.target?.activeCues[0]?.id, 'time', video.currentTime);

	activeCue.set(event?.target?.activeCues[0]?.id);
};

// export const timer = writable<number>(0);

/* TODO alternative au timer actuel
- genérer un audio
-> verifier s'il peut se jouer en mute 
- definir la durée souhaitée
	- attention à la gestion des pauses 
- passer le generateur dans le player ! 
- mettre le timer à disposition

*/
export function cueTimer(video: HTMLVideoElement) {
	let timer = 0;
	const track = video.addTextTrack('metadata', 'meta', 'fr');

	const onChange = (event: any) => {
		const cue = new VTTCue(timer, 0, String(timer));
		track.addCue(cue);
		timer == 0 && console.log('CUE |-->', event?.target?.activeCues[0]?.start);

		console.log(
			`CUE |-->' time : ${Math.round(video.currentTime * 1000)}, timer : ${Math.round(timer * 1000)}, diff : ${Math.abs((video.currentTime - timer) * 1000)}`
		);

		timer += 0.01;
	};
	onChange(null);
	console.log(track);

	track.addEventListener('cuechange', onChange);
	return () => track.removeEventListener('cuechange', onChange);
}
