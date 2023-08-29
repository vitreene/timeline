import * as THREE from 'three';
// types :
// https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/three-types.ts

import { LAYER01, TRACK_PLAY } from '../../common/constants';

import type { RunEvent } from '../channels/channel';
import { THR3DTypes as P, Thr3dPersoNode, Thr3dSceneNode } from '../../types';

const size = { width: 800, height: 1000 };
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
			},
			camera: {
				type: 'PerspectiveCamera',
				params: [50, ratio, 0.1, 1000],
				position: { x: -0.2, y: 1.65, z: 0.6 },
			},
			controls: {
				enableDamping: true,
				target: { x: 0, y: 1.58, z: 0 },
			},
		},
	},
	actions: {
		enter: {
			move: LAYER01,
		},
	},
};

export const modelWes: Thr3dPersoNode = {
	type: P.THR3D_PERSO,
	initial: {
		src: 'wes/wes.gltf',
		loader: 'gltf',
		track: TRACK_PLAY,
		content: {
			scene: {
				name: 'modelWes',
				position: { y: -1.6, z: 0.4 },
				traverse: (child) => {
					if (child.type == 'SkinnedMesh') {
						child.frustumCulled = false;
					}
				},
			},
			// animations: {},
			add: ['*'], // * === self
			store: ['*', 'charhairstyle', 'chareyes'],
			mixer: ['*'],
			child: [{ charhairstyle: { scene: { visible: false } } }],
		},
	},
	actions: {},
	emit: { loadeddata: { data: { loaded: sceneLoaded } } },
};

export const lipsync: Thr3dPersoNode = {
	type: P.THR3D_PERSO,
	initial: {
		src: 'wes/lipsync.glb',
		loader: 'gltf',
		track: TRACK_PLAY,
		content: {
			animations: {},
		},
	},
	actions: {},
	emit: {
		loadeddata: {
			data: { loaded: animationsLoaded, mixer: 'modelWes' },
		},
	},
};

interface ThreeGLB {
	scene: THREE.Object3D<THREE.Event>;
	animations: THREE.AnimationClip[];
}
type Thr3dCbLoaded = Record<string, (ThreeGLB | THREE.Object3D)[]>;

function sceneLoaded(gltf: ThreeGLB): Thr3dCbLoaded {
	gltf.scene.traverse((child) => {
		//
		if (child.type == 'SkinnedMesh') {
			child.frustumCulled = false;
		}
	});
	const man = gltf;
	man.scene.name = 'modelWes'; //
	// man.scene.position.y = -1.6; //
	// man.scene.position.z = 0.4; //
	const hair = man.scene.getObjectByName('charhairstyle'); //
	hair.visible = false; //
	const eyes = man.scene.getObjectByName('chareyes'); //

	return { add: [man], store: [man, eyes, hair], mixer: [man] }; //
}

function animationsLoaded(gltf: ThreeGLB) {
	const lipsync = gltf;
	return function (mixer: THREE.AnimationMixer) {
		const phonemes: string[] = [];
		const visemes: Record<string, THREE.AnimationAction> = {};

		for (const anim of lipsync.animations) {
			if (anim.name !== 'stand_talk') {
				THREE.AnimationUtils.makeClipAdditive(anim);
			}
			const animationAction = mixer.clipAction(anim);
			animationAction.clampWhenFinished = true;

			animationAction.setLoop(THREE.LoopOnce, 1).setEffectiveTimeScale(0.65).setEffectiveWeight(1);
			visemes[anim.name] = animationAction;

			if (anim.name === 'stand_talk') {
				animationAction.setLoop(THREE.LoopRepeat, 4);
				animationAction.enabled = true;
				animationAction.setEffectiveTimeScale(0.5).setEffectiveWeight(0.5).startAt(2).play();
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
		const duration = data && data.duration ? data.duration / 1000 : 0;
		if (name in visemes) {
			precAction = activeAction;
			activeAction = visemes[name];
			if (precAction && activeAction) {
				const d = Math.min(0.3, duration);
				precAction.fadeOut(0.12).stop();
				activeAction.setDuration(duration).fadeIn(d).play();
			}
		}
	};
}
