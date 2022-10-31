import { TRACK_PLAY } from '../common/constants';
import { PersoElementType as P, Thr3dSceneNode } from '../types';

export const modelWes = {
	type: P.THR3D,
	initial: { src: 'wes/wes.gltf', loader: 'gltf', track: TRACK_PLAY },
	actions: {},
} as const;

const size = { width: 500, height: 400 };
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
				setSize: size,
			},
			camera: {
				type: 'PerspectiveCamera',
				params: [50, ratio, 0.1, 1000],
				position: { x: 0.01, y: 1.6, z: 1.1 },
				lookAt: { x: 0, y: 1.6, z: 1 },
			},
			controls: {
				enableDamping: true,
				target: { x: 0, y: 1, z: 0 },
			},
		},
	},
	actions: {},
};

// exemple
const sound_23_04 = {
	type: P.SOUND,
	initial: { src: '/023_04.ogg', track: TRACK_PLAY },
	actions: {
		start_sound_23_04: { action: 'start' },
		end_sound_23_04: { action: 'end' },
	},
} as const;
