<script lang="ts">
	import MediaEvents from './scene-medias.svelte';
	import type { SceneMedia } from '$lib/server/db';

	export let medias: Array<SceneMedia>;
	console.log(medias);
</script>

<div class="medias">Médias</div>
<ul>
	{#each medias as media}
		<li class="scene-media-list-item"><MediaEvents {media} /></li>
	{/each}
</ul>

<style>
	.scene-media-list-item {
		position: relative;
	}
</style>
