import { TRACK_PLAY } from '../common/constants';
import { PersoElementType as P } from '../types';

export const modelWes = {
	type: P.THR3D,
	initial: { src: 'wes/wes.gltf', loader: 'gltf', track: TRACK_PLAY },
	actions: {},
} as const;

// exemple
const sound_23_04 = {
	type: P.SOUND,
	initial: { src: '/023_04.ogg', track: TRACK_PLAY },
	actions: {
		start_sound_23_04: { action: 'start' },
		end_sound_23_04: { action: 'end' },
	},
} as const;
