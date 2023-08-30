import { PersosTypes as P } from '../../../types';
import { LAYER02 } from '../../../common/constants';

export const tv = {
	type: P.SPRITE,
	initial: {
		content: { src: '/old-television.webp' },
		style: {
			position: 'absolute',
			width: 600,
			x: 500,
			y: 250,
		},
	},
	actions: {
		enter: {
			move: LAYER02,
		},
	},
} as const;

export const kid = {
	type: P.SPRITE,
	initial: {
		content: { src: '/phonemes/kid.png' },
		style: {
			position: 'absolute',
			width: 481 / 2,
			height: 633 / 2,
			x: 630,
			y: 270,
		},
	},
	actions: {
		enter: {
			move: LAYER02,
		},
	},
} as const;

export const mouth = {
	type: P.SPRITE,
	initial: {
		content: { src: '/phonemes/X.png' },
		style: {
			position: 'absolute',
			x: 710,
			y: 480,
			width: 160 / 2,
			height: 100 / 2,
		},
	},
	actions: {
		enter: {
			move: LAYER02,
		},
		A: { content: { src: '/phonemes/A.png' } },
		B: { content: { src: '/phonemes/B.png' } },
		C: { content: { src: '/phonemes/C.png' } },
		D: { content: { src: '/phonemes/D.png' } },
		E: { content: { src: '/phonemes/E.png' } },
		F: { content: { src: '/phonemes/F.png' } },
		G: { content: { src: '/phonemes/G.png' } },
		H: { content: { src: '/phonemes/H.png' } },
		X: { content: { src: '/phonemes/A.png' } },
	},
} as const;
