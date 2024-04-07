<script lang="ts">
	import type { CapsuleComp, SceneMedia } from '$lib/server/db';
	import Capsule from './capsule.svelte';

	export let capsules: Array<CapsuleComp>;
	export let medias: Array<SceneMedia>;

	const mediasEvents = new Map(medias.flatMap((m) => m.events).map((e) => [e.id, e]));
</script>

<div>
	<form id="text-time" method="POST" action="?/transition">
		<button type="reset">reset</button>
	</form>

	{#if capsules.length == 0}
		<h2>CAPSULEs</h2>
	{:else}
		{#each capsules as capsule}
			<Capsule {capsule} {mediasEvents} />
		{/each}
	{/if}
</div>
