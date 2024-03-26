<script lang="ts">
	import type { ElementComp } from '$lib/server/db';

	export let element: ElementComp;

	const intro = `intro/${element.id}`;
	const outro = `outro/${element.id}`;
</script>

<section class="capsule">
	<input form="text-time" type="submit" id={intro} name="action" value={intro} />
	<label for={intro}>entrée</label>
	<img class="vignette" src={`/${element.media.path}`} alt="media" />
	<input form="text-time" type="submit" id={outro} name="action" value={outro} />
	<label for={outro}>sortie</label>
</section>

<style>
	.capsule {
		position: relative;
		margin-bottom: 0.5rem;
		border: thin gray solid;
	}
	label {
		display: block;
		margin: 0.25rem;
		padding: 0.25em 0.5em;
		font-size: 0.85rem;
		font-variant: small-caps;
		background-color: aquamarine;
	}

	label:hover {
		background-color: chartreuse;
	}
	input {
		visibility: hidden;
		position: absolute;
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
