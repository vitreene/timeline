<script lang="ts">
	import SceneMediaEvents from './scene-medias.svelte';
	import type { CapsuleComp, SceneMedia } from '$lib/server/db';

	export let medias: Array<SceneMedia>;
	export let capsules: Array<CapsuleComp>;

	const countEvents: Record<string, number> = {};
	capsules.map((c) => {
		const names = c.elements.flatMap((e) => e.events.map((ev) => ev.name));
		names.forEach(function (i) {
			countEvents[i] = (countEvents[i] || 0) + 1;
		});
	});

	medias = medias.map((media) => {
		const events = media.events.map((e) => {
			if (countEvents[e.id]) {
				return { ...e, count: countEvents[e.id] };
			}
			return e;
		});
		return { ...media, events };
	});
</script>

<div class="medias">
	<h4>Médias</h4>
	<ul>
		{#each medias as media}
			<li class="scene-media-list-item"><SceneMediaEvents {media} /></li>
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
