<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const scene = data.scene;
	console.log('page scene', scene);
	// console.log(scene.capsules[0].elements);
</script>

<div>
	<h1>Capsules</h1>
	<main>
		<div>
			{#each scene.capsules as capsule}
				<h2>{capsule.id}</h2>
				<p class="bold">{capsule.type}</p>
				{#each capsule.elements as element}
					<p>{element.media.type}</p>
					<p>{element.media.path}</p>
				{/each}
			{/each}
		</div>
	</main>
</div>

<style>
	.bold {
		font-weight: 700;
	}
</style>
