import { Eventime, SoundType as P } from '../../../types';
import { MAIN, LAYER02, TRACK_PLAY, THR3D } from '../../../common/constants';

export const sound_1_7b_e_fr = {
	type: P.SOUND,
	initial: { src: '/1_7b_e.mp3', track: TRACK_PLAY },
	actions: {
		start_sound_fr: { action: 'start' },
		end_sound_fr: { action: 'end' },
	},
} as const;

export const cueEventsFR: Eventime['events'] = [
	{
		startAt: 0,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 80,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 150,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 290,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 500,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 570,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 710,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 920,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 1150,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 1320,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 1530,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 2090,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 2230,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 2300,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 2440,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 2930,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 3300,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 3540,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 3890,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 4100,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 4170,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 4800,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 4940,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 5020,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 5170,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 5240,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 5310,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 5520,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 5590,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 5800,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 6010,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 6390,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 6490,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 6570,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 6890,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 7240,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 7310,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 7380,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 7450,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 7590,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 7800,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 7870,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 8080,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 8220,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 8640,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 8720,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 8850,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 8920,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 9000,
		name: 'D',
		channel: MAIN,
	},
	{
		startAt: 9130,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 9200,
		name: 'D',
		channel: MAIN,
	},
	{
		startAt: 9410,
		name: 'H',
		channel: MAIN,
	},
	{
		startAt: 9480,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 9550,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 9900,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 10040,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 10110,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 10390,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 10460,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 10530,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 11160,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 11460,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 11530,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 11600,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 11880,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 11950,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 12090,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 12160,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 12230,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 12440,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 12510,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 12580,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 12720,
		name: 'D',
		channel: MAIN,
	},
	{
		startAt: 12820,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 12860,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 12930,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 12990,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 13070,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 13160,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 13300,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 13380,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 13680,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 13750,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 14030,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 14100,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 14180,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 14300,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 14440,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 14580,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 14860,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 15060,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 15260,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 15340,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 15600,
		name: 'H',
		channel: MAIN,
	},
	{
		startAt: 15740,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 15880,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 15950,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 16020,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 16460,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 16530,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 16600,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 16650,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 16770,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 16840,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 16910,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 16990,
		name: 'D',
		channel: MAIN,
	},
	{
		startAt: 17150,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 17190,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 17380,
		name: 'X',
		channel: MAIN,
	},
];

// anim.name @
// anim.name a
// anim.name e
// anim.name E
// anim.name f
// anim.name i
// anim.name k
// anim.name o
// anim.name O
// anim.name p
// anim.name r
// anim.name s
// anim.name S
// anim.name T
// anim.name t
// anim.name u
// anim.name sil
// anim.name stand_talk
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

const mouthCues = [
	{ start: 0.0, end: 0.08, value: 'X' },
	{ start: 0.08, end: 0.15, value: 'B' },
	{ start: 0.15, end: 0.29, value: 'F' },
	{ start: 0.29, end: 0.5, value: 'B' },
	{ start: 0.5, end: 0.57, value: 'E' },
	{ start: 0.57, end: 0.71, value: 'B' },
	{ start: 0.71, end: 0.92, value: 'F' },
	{ start: 0.92, end: 1.15, value: 'A' },
	{ start: 1.15, end: 1.32, value: 'B' },
	{ start: 1.32, end: 1.53, value: 'C' },
	{ start: 1.53, end: 2.09, value: 'B' },
	{ start: 2.09, end: 2.23, value: 'F' },
	{ start: 2.23, end: 2.3, value: 'B' },
	{ start: 2.3, end: 2.44, value: 'C' },
	{ start: 2.44, end: 2.93, value: 'B' },
	{ start: 2.93, end: 3.3, value: 'X' },
	{ start: 3.3, end: 3.54, value: 'B' },
	{ start: 3.54, end: 3.89, value: 'F' },
	{ start: 3.89, end: 4.1, value: 'B' },
	{ start: 4.1, end: 4.17, value: 'E' },
	{ start: 4.17, end: 4.8, value: 'B' },
	{ start: 4.8, end: 4.94, value: 'F' },
	{ start: 4.94, end: 5.02, value: 'A' },
	{ start: 5.02, end: 5.17, value: 'F' },
	{ start: 5.17, end: 5.24, value: 'G' },
	{ start: 5.24, end: 5.31, value: 'F' },
	{ start: 5.31, end: 5.52, value: 'B' },
	{ start: 5.52, end: 5.59, value: 'G' },
	{ start: 5.59, end: 5.8, value: 'C' },
	{ start: 5.8, end: 6.01, value: 'B' },
	{ start: 6.01, end: 6.39, value: 'X' },
	{ start: 6.39, end: 6.49, value: 'B' },
	{ start: 6.49, end: 6.57, value: 'A' },
	{ start: 6.57, end: 6.89, value: 'E' },
	{ start: 6.89, end: 7.24, value: 'B' },
	{ start: 7.24, end: 7.31, value: 'E' },
	{ start: 7.31, end: 7.38, value: 'F' },
	{ start: 7.38, end: 7.45, value: 'B' },
	{ start: 7.45, end: 7.59, value: 'C' },
	{ start: 7.59, end: 7.8, value: 'B' },
	{ start: 7.8, end: 7.87, value: 'G' },
	{ start: 7.87, end: 8.08, value: 'B' },
	{ start: 8.08, end: 8.22, value: 'E' },
	{ start: 8.22, end: 8.64, value: 'B' },
	{ start: 8.64, end: 8.72, value: 'A' },
	{ start: 8.72, end: 8.85, value: 'C' },
	{ start: 8.85, end: 8.92, value: 'B' },
	{ start: 8.92, end: 9.0, value: 'A' },
	{ start: 9.0, end: 9.13, value: 'D' },
	{ start: 9.13, end: 9.2, value: 'F' },
	{ start: 9.2, end: 9.41, value: 'D' },
	{ start: 9.41, end: 9.48, value: 'H' },
	{ start: 9.48, end: 9.55, value: 'C' },
	{ start: 9.55, end: 9.9, value: 'F' },
	{ start: 9.9, end: 10.04, value: 'B' },
	{ start: 10.04, end: 10.11, value: 'G' },
	{ start: 10.11, end: 10.39, value: 'F' },
	{ start: 10.39, end: 10.46, value: 'C' },
	{ start: 10.46, end: 10.53, value: 'B' },
	{ start: 10.53, end: 11.16, value: 'X' },
	{ start: 11.16, end: 11.46, value: 'B' },
	{ start: 11.46, end: 11.53, value: 'G' },
	{ start: 11.53, end: 11.6, value: 'C' },
	{ start: 11.6, end: 11.88, value: 'B' },
	{ start: 11.88, end: 11.95, value: 'C' },
	{ start: 11.95, end: 12.09, value: 'B' },
	{ start: 12.09, end: 12.16, value: 'C' },
	{ start: 12.16, end: 12.23, value: 'B' },
	{ start: 12.23, end: 12.44, value: 'E' },
	{ start: 12.44, end: 12.51, value: 'F' },
	{ start: 12.51, end: 12.58, value: 'B' },
	{ start: 12.58, end: 12.72, value: 'C' },
	{ start: 12.72, end: 12.82, value: 'D' },
	{ start: 12.82, end: 12.86, value: 'C' },
	{ start: 12.86, end: 12.93, value: 'A' },
	{ start: 12.93, end: 12.99, value: 'B' },
	{ start: 12.99, end: 13.07, value: 'A' },
	{ start: 13.07, end: 13.16, value: 'B' },
	{ start: 13.16, end: 13.3, value: 'F' },
	{ start: 13.3, end: 13.38, value: 'A' },
	{ start: 13.38, end: 13.68, value: 'B' },
	{ start: 13.68, end: 13.75, value: 'C' },
	{ start: 13.75, end: 14.03, value: 'F' },
	{ start: 14.03, end: 14.1, value: 'B' },
	{ start: 14.1, end: 14.18, value: 'A' },
	{ start: 14.18, end: 14.3, value: 'C' },
	{ start: 14.3, end: 14.44, value: 'B' },
	{ start: 14.44, end: 14.58, value: 'F' },
	{ start: 14.58, end: 14.86, value: 'B' },
	{ start: 14.86, end: 15.06, value: 'X' },
	{ start: 15.06, end: 15.26, value: 'B' },
	{ start: 15.26, end: 15.34, value: 'A' },
	{ start: 15.34, end: 15.6, value: 'B' },
	{ start: 15.6, end: 15.74, value: 'H' },
	{ start: 15.74, end: 15.88, value: 'C' },
	{ start: 15.88, end: 15.95, value: 'E' },
	{ start: 15.95, end: 16.02, value: 'B' },
	{ start: 16.02, end: 16.46, value: 'X' },
	{ start: 16.46, end: 16.53, value: 'B' },
	{ start: 16.53, end: 16.6, value: 'A' },
	{ start: 16.6, end: 16.65, value: 'F' },
	{ start: 16.65, end: 16.77, value: 'B' },
	{ start: 16.77, end: 16.84, value: 'F' },
	{ start: 16.84, end: 16.91, value: 'B' },
	{ start: 16.91, end: 16.99, value: 'A' },
	{ start: 16.99, end: 17.15, value: 'D' },
	{ start: 17.15, end: 17.19, value: 'C' },
	{ start: 17.19, end: 17.38, value: 'B' },
	{ start: 17.38, end: 17.39, value: 'X' },
];

/* 

const doCueEvents = mouthCues.map((cue) => {
	return { startAt: cue.start * 1000, name: cue.value, channel: MAIN };
});

console.log('doCueEvents');
console.log(doCueEvents);


*/

export const cueEventsThreeFR: Eventime[] = mouthCues.map((cue) => {
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

// console.log(cueEventsThree);

const _cueEventsThree = [
	{
		startAt: 0,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 80,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 150,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 290,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 500,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 570,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 710,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 920,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 230,
		},
	},
	{
		startAt: 1150,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 170,
		},
	},
	{
		startAt: 1320,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 1530,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 560,
		},
	},
	{
		startAt: 2090,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 2230,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 2300,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 2440,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 490,
		},
	},
	{
		startAt: 2930,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 370,
		},
	},
	{
		startAt: 3300,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 240,
		},
	},
	{
		startAt: 3540,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 350,
		},
	},
	{
		startAt: 3890,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 4100,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 4170,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 630,
		},
	},
	{
		startAt: 4800,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 4940,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 5020,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 150,
		},
	},
	{
		startAt: 5170,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 5240,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 5310,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 5520,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 5590,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 5800,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 6010,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 380,
		},
	},
	{
		startAt: 6390,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 100,
		},
	},
	{
		startAt: 6490,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 6570,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 320,
		},
	},
	{
		startAt: 6890,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 350,
		},
	},
	{
		startAt: 7240,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7310,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7380,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7450,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 7590,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 7800,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7870,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 8080,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 8220,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 420,
		},
	},
	{
		startAt: 8640,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 8720,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 130,
		},
	},
	{
		startAt: 8850,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 8920,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 9000,
		name: '@',
		channel: 'THR3D',
		data: {
			duration: 130,
		},
	},
	{
		startAt: 9130,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 9200,
		name: '@',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 9410,
		name: 't',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 9480,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 9550,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 350,
		},
	},
	{
		startAt: 9900,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 10040,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 10110,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 10390,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 10460,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 10530,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 630,
		},
	},
	{
		startAt: 11160,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 300,
		},
	},
	{
		startAt: 11460,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 11530,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 11600,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 11880,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 11950,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 12090,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 12160,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 12230,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 12440,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 12510,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 12580,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 12720,
		name: '@',
		channel: 'THR3D',
		data: {
			duration: 100,
		},
	},
	{
		startAt: 12820,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 40,
		},
	},
	{
		startAt: 12860,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 12930,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 60,
		},
	},
	{
		startAt: 12990,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 13070,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 90,
		},
	},
	{
		startAt: 13160,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 13300,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 13380,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 300,
		},
	},
	{
		startAt: 13680,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 13750,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 14030,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 14100,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 14180,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 120,
		},
	},
	{
		startAt: 14300,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 14440,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 14580,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 14860,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 200,
		},
	},
	{
		startAt: 15060,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 200,
		},
	},
	{
		startAt: 15260,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 15340,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 260,
		},
	},
	{
		startAt: 15600,
		name: 't',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 15740,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 15880,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 15950,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16020,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 440,
		},
	},
	{
		startAt: 16460,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16530,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16600,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 50,
		},
	},
	{
		startAt: 16650,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 120,
		},
	},
	{
		startAt: 16770,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16840,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16910,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 16990,
		name: '@',
		channel: 'THR3D',
		data: {
			duration: 160,
		},
	},
	{
		startAt: 17150,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 40,
		},
	},
	{
		startAt: 17190,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 190,
		},
	},
	{
		startAt: 17380,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 10,
		},
	},
];
