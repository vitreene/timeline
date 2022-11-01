import * as THREE from 'three';

import { LAYER01, TRACK_PLAY } from '../common/constants';

import type { RunEvent } from '../channels/channel';
import { PersoElementType as P, Thr3dSceneNode } from '../types';

const size = { width: 800, height: 600 };
const ratio = size.width / size.height;

export const talk3d: Thr3dSceneNode = {
	type: P.THR3D_SCENE,
	initial: {
		style: size,
		content: {
			children: ['modelWes', 'lipsync'],
			renderer: {
				type: 'WebGLRenderer',
				params: { alpha: true },
				setSize: [size.width, size.height],
			},
			camera: {
				type: 'PerspectiveCamera',
				params: [50, ratio, 0.1, 1000],
				position: { x: 0, y: 0, z: 1 },
				// lookAt: { x: 0, y: 1.6, z: 1 },
				lookAt: [0, 0, 0],
			},
			controls: {
				enableDamping: true,
				target: { x: 0, y: 1, z: 0 },
			},
		},
	},
	actions: {
		enter: {
			move: LAYER01,
		},
	},
};

export const modelWes = {
	type: P.THR3D,
	initial: { src: 'wes/wes.gltf', loader: 'gltf', track: TRACK_PLAY },
	actions: {},
	emit: {
		loadeddata: {
			data: { loaded: sceneLoaded },
		},
	},
} as const;

export const lipsync = {
	type: P.THR3D,
	initial: { src: 'wes/lipsync.glb', loader: 'gltf', track: TRACK_PLAY },
	actions: {},
	emit: {
		loadeddata: {
			data: { loaded: animationsLoaded, mixer: 'modelWes' },
		},
	},
} as const;

interface ThreeGLB {
	scene: THREE.Object3D<THREE.Event>;
	animations: THREE.AnimationClip[];
}
type Thr3dCbLoaded = Record<string, (ThreeGLB | THREE.Object3D)[]>;

function sceneLoaded(gltf: ThreeGLB): Thr3dCbLoaded {
	gltf.scene.traverse((child) => {
		if (child.type == 'SkinnedMesh') {
			child.frustumCulled = false;
		}
	});
	const man = gltf;
	man.scene.name = 'modelWes';
	man.scene.position.y = -1.6;
	man.scene.position.z = 0.4;
	const hair = man.scene.getObjectByName('charhairstyle');
	hair.visible = false;
	const eyes = man.scene.getObjectByName('chareyes');

	return { add: [man], store: [man, eyes, hair], mixer: [man] };
}

function animationsLoaded(gltf: ThreeGLB) {
	const lipsync = gltf;
	return function (mixer: THREE.AnimationMixer) {
		const phonemes: string[] = [];
		const visemes: Record<string, THREE.AnimationAction> = {};
		const duration = 0.3;

		console.log('mixer::::::', mixer);

		for (const anim of lipsync.animations) {
			if (anim.name !== 'stand_talk') {
				THREE.AnimationUtils.makeClipAdditive(anim);
			}
			const animationAction = mixer.clipAction(anim);
			animationAction.setLoop(THREE.LoopOnce, 1).setDuration(duration);
			visemes[anim.name] = animationAction;

			if (anim.name === 'stand_talk') {
				animationAction.setLoop(THREE.LoopRepeat, 4);
				animationAction.enabled = true;
				animationAction.setEffectiveTimeScale(0.625);
				animationAction.setEffectiveWeight(1);
				animationAction.play();
				console.log('stand_talk', animationAction.getRoot());
			} else {
				phonemes.push(anim.name);
			}
		}
		return { add: [lipsync], channelStore: runVisemes(visemes) };
	};
}

function runVisemes(visemes) {
	let precAction: THREE.AnimationAction;
	let activeAction: THREE.AnimationAction;

	return function ({ data, name }: RunEvent) {
		const d = data && data.duration ? data.duration / 1000 : 0;

		precAction && precAction.stopFading();
		precAction = activeAction;
		activeAction = visemes[name];
		if (precAction && activeAction) {
			precAction.fadeOut(d).reset();
			activeAction.fadeIn(d).play();
		}
	};
}
