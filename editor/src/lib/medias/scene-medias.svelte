<script lang="ts">
	import MediaEvents from './media-events.svelte';
	import type { SceneMedia } from '$lib/server/db';

	export let media: SceneMedia;
	const name = (/([^\/]+)$/.exec(media.path ?? '') ?? [])[1];
</script>

<div class="media-scene-item-content">
	<details class="media-scene-item">
		<summary class="media-scene-item-name">{name} </summary>
		<audio src={media.path} controls />
	</details>
	<MediaEvents events={media.events} />
</div>

<style>
	.media-scene-item {
		margin-bottom: 0.5rem;
	}
	audio {
		margin: 0.5rem 0;
	}
	.media-scene-item-content {
		padding: 0.5rem;
	}
</style>
