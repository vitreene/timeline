<script lang="ts">
	import { onMount } from 'svelte';

	import type { BuildPlayType } from '$lib/player/build-play';
	import type { Controller } from '@vitreene/sceneline';

	import './style.css';
	import type { SceneComp } from '$lib/server/db';

	export let scene: SceneComp;
	let controller: Controller;

	onMount(async () => {
		const { buildPlay } = await import('$lib/player/build-play');
		const { Controller, preload } = await import('@vitreene/sceneline');

		const stage = buildPlay(scene);

		if (stage) {
			preload(stage.persos).then((store) => {
				console.log('LOAD STORE', store);

				controller = new Controller(store, stage.events);

				controller.start().play();
				console.log(controller);
				setTimeout(() => {
					controller.stop();
				}, 7000);
			});
		}
	});
</script>

<div id="app"></div>
