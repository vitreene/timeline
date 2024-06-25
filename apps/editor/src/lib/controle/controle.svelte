<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { Controller } from '@vitreene/sceneline';

	import type { SceneComp } from '$lib/server/db';
	import { addCuesToVideo } from '$lib/player/cues';

	export let scene: SceneComp;
	let controller: Controller;
	let canPlay: boolean = false;
	let buttonInfo = 'PLAY';
	const removes: Array<() => void> = [];
	onDestroy(() => removes.forEach((r) => r()));

	onMount(async () => {
		const { buildPlay } = await import('$lib/player/build-play');
		const { Controller, preload } = await import('@vitreene/sceneline');

		const stage = buildPlay(scene);

		if (stage) {
			preload(stage.persos).then((store) => {
				console.log('LOAD STORE', store);

				controller = new Controller(store, stage.events);

				for (const media of scene.medias) {
					const perso = controller.persos.store.get(String(media.id));
					if (perso) {
						const video = perso.node as HTMLVideoElement;
						removes.push(addCuesToVideo(video, media));
					}
				}
				canPlay = true;
			});
		}
	});

	function play() {
		// setTimeout(() => {
		// 	console.log('setTimeout terminate');
		// 	counter.terminate();
		// }, 4000);

		if (controller.isPlaying) {
			// controller.seek(0);
			controller.stop();
			// counter.postMessage('stop');

			buttonInfo = 'PLAY';
		} else {
			buttonInfo = 'STOP';
			controller.start().play();
			// counter.postMessage('start');

			console.log(controller);
		}
	}
	/* TODO connecter cet emetteur au systeme de tickers comme time provider
	let counter: Worker;
	try {
		counter = new Worker(new URL('../utils/worker-timer.ts', import.meta.url));
		
		counter.onmessage = (e) => {
			console.log(e.data);
			// if (e.data % 1000 == 0) console.log(e.data);
		};
	} catch (e) {
		console.log(e);
	}
	*/
</script>

<button on:click={play} disabled={!canPlay}>{buttonInfo}</button>
