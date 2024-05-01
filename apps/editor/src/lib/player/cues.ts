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
	track.addEventListener('cuechange', onChange);

	return () => track.removeEventListener('cuechange', onChange);
}

const onChange = (event: any) => {
	console.log('CUE-->', event?.target?.activeCues[0]?.id);

	activeCue.set(event?.target?.activeCues[0]?.id);
};
