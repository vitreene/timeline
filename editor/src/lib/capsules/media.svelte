<script lang="ts">
	import type { ElementComp } from '$lib/server/db';

	export let element: ElementComp;
</script>

<section>
	<p>entrée</p>
	<img class="vignette" src={`/${element.media.path}`} alt="media" />
	<p>sortie</p>
</section>

<style>
	section {
		margin-bottom: 0.5rem;
	}
	p {
		margin: 0;
	}
	.vignette {
		margin: 0;
		object-fit: contain;
		max-width: 100%;
		aspect-ratio: 4/3;
	}
</style>
