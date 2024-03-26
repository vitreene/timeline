<script lang="ts">
	import type { PageData } from './$types';
	import Capsules from '$lib/capsules/capsules.svelte';
	import Medias from '$lib/medias/medias.svelte';
	export let data: PageData;
	const scene = data.scene;
</script>

{#if scene !== null}
	<main class="scene">
		<div class="chutier">1</div>
		<div class="live">2</div>
		<div class="capsule"><Capsules capsules={scene.capsules} /></div>
		<div class="controle">controle</div>
		<div class="media"><Medias medias={scene.medias} /></div>
	</main>
{/if}

<style>
	.scene {
		display: grid;
		grid-area: 1 / 1;
		grid-template-areas:
			'chutier scene capsule'
			'chutier controle capsule'
			'media media capsule';
		gap: 10px;
		grid-template-columns: 1fr 4fr 2fr;
		grid-template-rows: 4fr 1fr 4fr;
		border: 1px solid rgb(111, 41, 97);
		max-height: 100%;
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
		overflow-y: scroll;
	}

	.controle {
		grid-area: controle;
	}

	.media {
		grid-area: media;
		overflow-y: scroll;
	}
</style>
