<script lang="ts">
	import type { CapsuleComp } from '$lib/server/db';
	import Media from './media.svelte';
	export let capsule: CapsuleComp;
</script>

<details class="capsule" open>
	<summary class="capsule-type">{capsule.type} </summary>

	{#each capsule.elements as element}
		<Media {element} />
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
