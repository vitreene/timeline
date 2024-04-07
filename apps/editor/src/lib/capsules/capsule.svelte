<script lang="ts">
	import type { CapsuleComp, TextTime } from '$lib/server/db';
	import Media from './capsule-media.svelte';
	export let capsule: CapsuleComp;
	export let mediasEvents: Map<string, TextTime>;
	const noTextTime: TextTime = { id: '', start: 0, end: 0, text: '' };
	const getTextTime = (id: string) => mediasEvents.get(id) ?? noTextTime;
</script>

<details class="capsule" open>
	<summary class="capsule-type">{capsule.type} </summary>

	{#each capsule.elements as element}
		<Media {element} {getTextTime} />
	{/each}
</details>

<style>
	.capsule {
		margin: 1rem 0;
		padding: 0 0.25rem 2rem;
		border: thin solid gray;
		background-color: bisque;
	}
	.capsule-type {
		margin: 0.5rem 0;
		font-weight: bold;
		font-size: 0.85rem;
		font-variant: small-caps;
	}
</style>
