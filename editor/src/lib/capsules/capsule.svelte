<script lang="ts">
	import type { CapsuleComp } from '$lib/server/db';
	import Media from './media.svelte';
	export let capsule: CapsuleComp;
</script>

<details open>
	<summary class="bold">{capsule.type} </summary>

	{#each capsule.elements as element}
		<Media {element} />
	{/each}
</details>

<style>
	.bold {
		font-weight: bold;
	}
</style>
