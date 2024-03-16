<script lang="ts">
	import type { PageData } from './$types';
	import Capsules from '$lib/capsules/capsules.svelte';
	export let data: PageData;
	console.log('page data', data);
	const scene = data.scene;
	console.log('page scene', scene);

	// console.log(scene.capsules[0].elements);
</script>

<div class="app">
	{#if scene !== null}
		<main class="scene">
			<div class="chutier">1</div>
			<div class="live">2</div>
			<div class="capsule"><Capsules capsules={scene.capsules} /></div>
			<div class="controle">controle</div>
			<div class="media">media</div>
		</main>
	{/if}
</div>

<style>
	.scene {
		display: grid;
		grid-template-areas:
			'chutier scene capsule'
			'chutier controle capsule'
			'media media capsule';
		gap: 10px;
		grid-template-columns: 1fr 4fr 2fr;
		grid-template-rows: 4fr 1fr 2fr;
		min-height: 100%;
		border: 1px solid rgb(111, 41, 97);
		/* inline-size: 500px; */
	}

	.scene > * {
		background-color: rgba(111, 41, 97, 0.4);
		border-radius: 2px;
		padding: 0.5rem;
	}

	.chutier {
		grid-area: chutier;
	}

	.scene {
		grid-area: scene;
	}

	.capsule {
		grid-area: capsule;
	}

	.controle {
		grid-area: controle;
	}

	.media {
		grid-area: media;
	}
</style>
