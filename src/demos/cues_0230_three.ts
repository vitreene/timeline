import { Eventime, PersoElementType as P } from '../types';
import { THR3D } from '../common/constants';

const mouthCues = [
	{ start: 0.0, end: 0.43, value: 'X' },
	{ start: 0.43, end: 0.49, value: 'B' },
	{ start: 0.49, end: 0.55, value: 'G' },
	{ start: 0.55, end: 0.62, value: 'B' },
	{ start: 0.62, end: 0.69, value: 'G' },
	{ start: 0.69, end: 0.76, value: 'E' },
	{ start: 0.76, end: 0.83, value: 'B' },
	{ start: 0.83, end: 1.04, value: 'F' },
	{ start: 1.04, end: 1.46, value: 'B' },
	{ start: 1.46, end: 1.6, value: 'C' },
	{ start: 1.6, end: 1.81, value: 'B' },
	{ start: 1.81, end: 2.1, value: 'X' },
	{ start: 2.1, end: 2.36, value: 'B' },
	{ start: 2.36, end: 2.44, value: 'A' },
	{ start: 2.44, end: 2.61, value: 'B' },
	{ start: 2.61, end: 2.69, value: 'A' },
	{ start: 2.69, end: 3.02, value: 'F' },
	{ start: 3.02, end: 3.09, value: 'G' },
	{ start: 3.09, end: 3.44, value: 'F' },
	{ start: 3.44, end: 3.79, value: 'B' },
	{ start: 3.79, end: 3.93, value: 'C' },
	{ start: 3.93, end: 4.14, value: 'B' },
	{ start: 4.14, end: 4.51, value: 'X' },
	{ start: 4.51, end: 4.58, value: 'B' },
	{ start: 4.58, end: 4.64, value: 'E' },
	{ start: 4.64, end: 4.71, value: 'F' },
	{ start: 4.71, end: 4.78, value: 'B' },
	{ start: 4.78, end: 5.06, value: 'C' },
	{ start: 5.06, end: 5.13, value: 'B' },
	{ start: 5.13, end: 5.4, value: 'X' },
	{ start: 5.4, end: 5.51, value: 'B' },
	{ start: 5.51, end: 5.58, value: 'C' },
	{ start: 5.58, end: 5.79, value: 'B' },
	{ start: 5.79, end: 5.86, value: 'G' },
	{ start: 5.86, end: 6.07, value: 'F' },
	{ start: 6.07, end: 6.14, value: 'E' },
	{ start: 6.14, end: 6.22, value: 'A' },
	{ start: 6.22, end: 6.3, value: 'B' },
	{ start: 6.3, end: 6.38, value: 'A' },
	{ start: 6.38, end: 6.49, value: 'B' },
	{ start: 6.49, end: 6.56, value: 'C' },
	{ start: 6.56, end: 6.63, value: 'B' },
	{ start: 6.63, end: 7.0, value: 'X' },
];

const convertVisemes = {
	A: 'p',
	B: 'k',
	C: 'a',
	D: '@',
	E: 'E',
	F: 'O',
	G: 'f',
	H: 't',
	X: 'sil',
};

export const cueEventsThree: Eventime[] = mouthCues.map((cue) => {
	const startAt = Math.round(cue.start * 1000);
	const duration = Math.round((cue.end - cue.start) * 1000);
	const name = convertVisemes[cue.value];
	return {
		startAt,
		name,
		channel: THR3D,
		data: { duration },
	};
});
