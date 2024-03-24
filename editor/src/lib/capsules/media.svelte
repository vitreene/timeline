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
		border: thin gray solid;
	}
	p {
		margin: 0;
		padding: 0.25rem 0.5rem;
		font-size: 0.85rem;
		font-variant: small-caps;
	}
	.vignette {
		margin: 0;
		padding: 0;
		object-fit: contain;
		max-width: 100%;
		aspect-ratio: 4/3;
	}
</style>
