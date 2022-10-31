import { LAYER01, STRAP, TRACK_PLAY } from '../common/constants';
import { PersoElementType as P, Thr3dSceneNode } from '../types';

const size = { width: 800, height: 600 };
const ratio = size.width / size.height;

export const talk3d: Thr3dSceneNode = {
	type: P.THR3D_SCENE,
	initial: {
		style: size,
		content: {
			children: ['modelWes'],
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
			data: { sceneLoaded },
		},
	},
} as const;

interface ThreeGLB {
	scene: THREE.Object3D<THREE.Event>;
	animations: THREE.AnimationClip[];
}

function sceneLoaded(gltf: ThreeGLB) {
	// console.log('sceneLoaded', gltf);

	gltf.scene.traverse((child) => {
		if (child.type == 'SkinnedMesh') {
			child.frustumCulled = false;
		}
	});
	const man = gltf;
	man.scene.position.y = -1.6;
	man.scene.position.z = 0.4;
	const hair = man.scene.getObjectByName('charhairstyle');
	hair.visible = false;
	const eyes = man.scene.getObjectByName('chareyes');

	return { add: [man], store: [eyes, hair] };
}
