<script lang="ts">
	import MediaEvents from './media-events.svelte';
	import type { SceneMedia } from '$lib/server/db';
	import { activeCue } from '../player/cues';

	let video: HTMLVideoElement;
	export let media: SceneMedia;
	const name = (/([^\/]+)$/.exec(media.path ?? '') ?? [])[1];
</script>

<div class="media-scene-item-content">
	<details class="media-scene-item">
		<summary class="media-scene-item-name">{name} </summary>
	</details>
	<MediaEvents events={media.events} activeCue={$activeCue} />
</div>

<style>
	.media-scene-item {
		margin-bottom: 0.5rem;
		cursor: pointer;
		user-select: none;
	}
	.media-scene-item-content {
		padding: 0.5rem;
	}
</style>
