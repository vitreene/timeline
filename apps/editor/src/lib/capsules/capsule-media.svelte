<script lang="ts">
	import ActionLine from './action-line.svelte';
	import type { ElementComp, TextTime } from '$lib/server/db';

	export let element: ElementComp;
	export let getTextTime: (id: string) => TextTime;

	const id = element.id;
	const events = new Map(element.events.map((e) => [e.action, e.name]));
	const actions = [
		{ id: 'intro', label: 'Entrée' },
		{ id: 'outro', label: 'Sortie' },
	].map(({ id, label }) => ({
		action: id,
		label: label,
		textTime: getTextTime(events.get(id) ?? ''),
	}));
</script>

<section id={`capsule/${id}`} class="capsule">
	<ActionLine {id} line={actions[0]} />
	<img class="vignette" src={`/${element.media.path}`} alt="media" />
	<ActionLine {id} line={actions[1]} />
</section>

<style>
	.capsule {
		position: relative;
		margin-bottom: 0.5rem;
		border: thin gray solid;
	}
	.vignette {
		margin: 0;
		padding: 0;
		object-fit: contain;
		max-width: 100%;
		aspect-ratio: 4/3;
		background-color: aliceblue;
	}
</style>
