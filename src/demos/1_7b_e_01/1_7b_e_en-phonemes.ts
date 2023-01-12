import { Eventime, SoundType as P } from '../../types';
import { MAIN, LAYER02, TRACK_ENGLISH, THR3D, TRACK_PLAY } from '../../common/constants';

export const sound_1_7b_e_en = {
	type: P.SOUND,
	initial: { src: '/1_7b_e-en.mp3', track: TRACK_ENGLISH },
	actions: {
		start_sound_en: { action: 'start' },
		end_sound_en: { action: 'end' },
	},
} as const;

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
	{ start: 0.0, end: 0.44, value: 'X' },
	{ start: 0.44, end: 0.52, value: 'C' },
	{ start: 0.52, end: 0.73, value: 'F' },
	{ start: 0.73, end: 0.87, value: 'C' },
	{ start: 0.87, end: 0.94, value: 'G' },
	{ start: 0.94, end: 1.29, value: 'B' },
	{ start: 1.29, end: 1.48, value: 'X' },
	{ start: 1.48, end: 1.54, value: 'B' },
	{ start: 1.54, end: 1.6, value: 'H' },
	{ start: 1.6, end: 1.67, value: 'C' },
	{ start: 1.67, end: 2.09, value: 'B' },
	{ start: 2.09, end: 2.17, value: 'A' },
	{ start: 2.17, end: 2.4, value: 'B' },
	{ start: 2.4, end: 2.47, value: 'C' },
	{ start: 2.47, end: 3.1, value: 'B' },
	{ start: 3.1, end: 3.52, value: 'X' },
	{ start: 3.52, end: 3.59, value: 'B' },
	{ start: 3.59, end: 3.65, value: 'G' },
	{ start: 3.65, end: 3.72, value: 'F' },
	{ start: 3.72, end: 3.79, value: 'B' },
	{ start: 3.79, end: 3.86, value: 'C' },
	{ start: 3.86, end: 3.93, value: 'E' },
	{ start: 3.93, end: 4.56, value: 'B' },
	{ start: 4.56, end: 4.63, value: 'F' },
	{ start: 4.63, end: 4.77, value: 'C' },
	{ start: 4.77, end: 4.85, value: 'A' },
	{ start: 4.85, end: 4.97, value: 'B' },
	{ start: 4.97, end: 5.04, value: 'G' },
	{ start: 5.04, end: 5.11, value: 'C' },
	{ start: 5.11, end: 5.32, value: 'B' },
	{ start: 5.32, end: 5.41, value: 'A' },
	{ start: 5.41, end: 6.52, value: 'X' },
	{ start: 6.52, end: 6.8, value: 'B' },
	{ start: 6.8, end: 6.94, value: 'F' },
	{ start: 6.94, end: 7.43, value: 'B' },
	{ start: 7.43, end: 7.57, value: 'C' },
	{ start: 7.57, end: 7.64, value: 'B' },
	{ start: 7.64, end: 7.71, value: 'C' },
	{ start: 7.71, end: 7.92, value: 'F' },
	{ start: 7.92, end: 7.99, value: 'C' },
	{ start: 7.99, end: 8.13, value: 'B' },
	{ start: 8.13, end: 8.2, value: 'C' },
	{ start: 8.2, end: 8.48, value: 'B' },
	{ start: 8.48, end: 8.55, value: 'G' },
	{ start: 8.55, end: 8.62, value: 'C' },
	{ start: 8.62, end: 8.76, value: 'B' },
	{ start: 8.76, end: 8.83, value: 'F' },
	{ start: 8.83, end: 9.48, value: 'B' },
	{ start: 9.48, end: 9.62, value: 'F' },
	{ start: 9.62, end: 9.69, value: 'E' },
	{ start: 9.69, end: 10.18, value: 'F' },
	{ start: 10.18, end: 10.39, value: 'B' },
	{ start: 10.39, end: 11.07, value: 'X' },
	{ start: 11.07, end: 11.58, value: 'B' },
	{ start: 11.58, end: 11.72, value: 'C' },
	{ start: 11.72, end: 11.79, value: 'B' },
	{ start: 11.79, end: 11.86, value: 'C' },
	{ start: 11.86, end: 11.93, value: 'B' },
	{ start: 11.93, end: 12.01, value: 'A' },
	{ start: 12.01, end: 12.42, value: 'B' },
	{ start: 12.42, end: 12.56, value: 'C' },
	{ start: 12.56, end: 12.77, value: 'B' },
	{ start: 12.77, end: 13.15, value: 'X' },
	{ start: 13.15, end: 13.28, value: 'C' },
	{ start: 13.28, end: 13.56, value: 'B' },
	{ start: 13.56, end: 13.63, value: 'H' },
	{ start: 13.63, end: 13.7, value: 'C' },
	{ start: 13.7, end: 14.33, value: 'B' },
	{ start: 14.33, end: 14.43, value: 'A' },
	{ start: 14.43, end: 14.83, value: 'B' },
	{ start: 14.83, end: 14.9, value: 'C' },
	{ start: 14.9, end: 15.04, value: 'E' },
	{ start: 15.04, end: 15.28, value: 'C' },
	{ start: 15.28, end: 15.42, value: 'B' },
	{ start: 15.42, end: 15.54, value: 'A' },
	{ start: 15.54, end: 15.62, value: 'C' },
	{ start: 15.62, end: 15.76, value: 'B' },
	{ start: 15.76, end: 15.9, value: 'E' },
	{ start: 15.9, end: 16.04, value: 'B' },
	{ start: 16.04, end: 16.53, value: 'X' },
	{ start: 16.53, end: 16.71, value: 'B' },
	{ start: 16.71, end: 16.78, value: 'C' },
	{ start: 16.78, end: 16.85, value: 'G' },
	{ start: 16.85, end: 16.92, value: 'C' },
	{ start: 16.92, end: 16.99, value: 'F' },
	{ start: 16.99, end: 17.27, value: 'B' },
	{ start: 17.27, end: 17.76, value: 'X' },
];

export const cueEventsThreeEN: Eventime[] = mouthCues.map((cue) => {
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

export const cueEventsEN: Eventime['events'] = mouthCues.map((cue) => {
	return { startAt: cue.start * 1000, name: cue.value, channel: MAIN };
});

const _cueEventsThree = [
	{
		startAt: 0,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 440,
		},
	},
	{
		startAt: 440,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 520,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 730,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 870,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 940,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 350,
		},
	},
	{
		startAt: 1290,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 190,
		},
	},
	{
		startAt: 1480,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 60,
		},
	},
	{
		startAt: 1540,
		name: 't',
		channel: 'THR3D',
		data: {
			duration: 60,
		},
	},
	{
		startAt: 1600,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 1670,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 420,
		},
	},
	{
		startAt: 2090,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 2170,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 230,
		},
	},
	{
		startAt: 2400,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 2470,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 630,
		},
	},
	{
		startAt: 3100,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 420,
		},
	},
	{
		startAt: 3520,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 3590,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 60,
		},
	},
	{
		startAt: 3650,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 3720,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 3790,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 3860,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 3930,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 630,
		},
	},
	{
		startAt: 4560,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 4630,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 4770,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 4850,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 120,
		},
	},
	{
		startAt: 4970,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 5040,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 5110,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 5320,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 90,
		},
	},
	{
		startAt: 5410,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 1110,
		},
	},
	{
		startAt: 6520,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 6800,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 6940,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 490,
		},
	},
	{
		startAt: 7430,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 7570,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7640,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7710,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 7920,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 7990,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 8130,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 8200,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 8480,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 8550,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 8620,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 8760,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 8830,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 650,
		},
	},
	{
		startAt: 9480,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 9620,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 9690,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 490,
		},
	},
	{
		startAt: 10180,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 10390,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 680,
		},
	},
	{
		startAt: 11070,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 510,
		},
	},
	{
		startAt: 11580,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 11720,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 11790,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 11860,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 11930,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 12010,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 410,
		},
	},
	{
		startAt: 12420,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 12560,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 210,
		},
	},
	{
		startAt: 12770,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 380,
		},
	},
	{
		startAt: 13150,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 130,
		},
	},
	{
		startAt: 13280,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 13560,
		name: 't',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 13630,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 13700,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 630,
		},
	},
	{
		startAt: 14330,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 100,
		},
	},
	{
		startAt: 14430,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 400,
		},
	},
	{
		startAt: 14830,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 14900,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 15040,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 240,
		},
	},
	{
		startAt: 15280,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 15420,
		name: 'p',
		channel: 'THR3D',
		data: {
			duration: 120,
		},
	},
	{
		startAt: 15540,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 80,
		},
	},
	{
		startAt: 15620,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 15760,
		name: 'E',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 15900,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 140,
		},
	},
	{
		startAt: 16040,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 490,
		},
	},
	{
		startAt: 16530,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 180,
		},
	},
	{
		startAt: 16710,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16780,
		name: 'f',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16850,
		name: 'a',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16920,
		name: 'O',
		channel: 'THR3D',
		data: {
			duration: 70,
		},
	},
	{
		startAt: 16990,
		name: 'k',
		channel: 'THR3D',
		data: {
			duration: 280,
		},
	},
	{
		startAt: 17270,
		name: 'sil',
		channel: 'THR3D',
		data: {
			duration: 490,
		},
	},
];
