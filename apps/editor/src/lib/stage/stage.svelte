<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { BuildPlayType } from '$lib/player/build-play';
	import type { Controller } from '@vitreene/sceneline';

	import './style.css';
	import type { SceneComp } from '$lib/server/db';
	import { addCuesToVideo } from '$lib/player/cues';

	export let scene: SceneComp;
	let controller: Controller;

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
