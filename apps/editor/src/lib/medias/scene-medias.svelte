<script lang="ts">
	import { onMount } from 'svelte';
	import MediaEvents from './media-events.svelte';
	import type { SceneMedia } from '$lib/server/db';

	let video: HTMLVideoElement;
	export let media: SceneMedia;
	const name = (/([^\/]+)$/.exec(media.path ?? '') ?? [])[1];
	let activeCue: string = '';

	const onChange = (event: any) => {
		activeCue = event.target.activeCues[0]?.id;
	};
	onMount(() => {
		const track = video.addTextTrack('metadata', 'meta', 'fr');
		media.events.forEach((e) => {
			const cue = new VTTCue(e.start, e.end, e.text);
			cue.id = e.id;
			track.addCue(cue);
			// cue.addEventListener('cuechange', onChange);
		});
		track.addEventListener('cuechange', onChange);
	});
</script>

<div class="media-scene-item-content">
	<details class="media-scene-item">
		<summary class="media-scene-item-name">{name} </summary>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video bind:this={video} src={media.path} controls autoplay muted> </video>
	</details>
	<MediaEvents events={media.events} {activeCue} />
</div>

<style>
	.media-scene-item {
		margin-bottom: 0.5rem;
		cursor: pointer;
		user-select: none;
	}
	video {
		margin: 0.5rem 0;
		height: 2rem;
		min-width: 20rem;
	}
	.media-scene-item-content {
		padding: 0.5rem;
	}
</style>
