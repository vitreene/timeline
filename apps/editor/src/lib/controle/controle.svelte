<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { BuildPlayType } from '$lib/player/build-play';
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
		if (controller.isPlaying) {
			// controller.seek(0);
			controller.stop();
			buttonInfo = 'PLAY';
		} else {
			buttonInfo = 'STOP';
			controller.start().play();
			console.log(controller);
		}
	}
</script>

<button on:click={play} disabled={!canPlay}>{buttonInfo}</button>
