<script lang="ts">
	import MediaEvents from './scene-medias.svelte';
	import type { SceneMedia } from '$lib/server/db';

	export let medias: Array<SceneMedia>;
</script>

<div class="medias">
	<h4>Médias</h4>
	<ul>
		{#each medias as media}
			<li class="scene-media-list-item"><MediaEvents {media} /></li>
		{/each}
	</ul>
</div>

<style>
	.scene-media-list-item {
		position: relative;
	}
	.medias ul,
	.medias li {
		margin: 0;
		padding: 0;
	}
</style>
