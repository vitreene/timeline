<script lang="ts">
	// import { Controller } from '@vitreene/sceneline';
	// const controller = new Controller();

	import { onMount } from 'svelte';

	onMount(async () => {
		const module = await import('@vitreene/sceneline');
		const { Controller } = module;

		// use module here...
	});
</script>

<div>STAGE</div>
