<script lang="ts">
	import type { PageData } from './$types';
	import Capsules from '$lib/capsules/capsules.svelte';
	import Medias from '$lib/medias/medias.svelte';
	import Stage from '$lib/stage/stage.svelte';
	import Controle from '$lib/controle/controle.svelte';

	export let data: PageData;
	const scene = data.scene;
	const { medias, capsules } = scene;
</script>

{#if scene !== null}
	<main class="scene">
		<div class="chutier">
			<p id="message">./.</p>
		</div>
		<div class="stage"><Stage /></div>
		<div class="capsule"><Capsules {medias} {capsules} /></div>
		<div class="controle"><Controle {scene} /></div>
		<div class="media"><Medias {medias} {capsules} /></div>
	</main>
{/if}

<style>
	.scene {
		display: grid;
		grid-area: 1 / 1;
		grid-template-areas:
			'chutier stage capsule'
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

	.stage {
		grid-area: stage;
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
