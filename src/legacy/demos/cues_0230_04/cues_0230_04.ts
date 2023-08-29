import { Eventime, SoundType, PersosTypes as P } from '../../../types';
import { MAIN, TRACK_PLAY } from '../../../common/constants';

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

const doCueEvents = mouthCues.map((cue) => {
	return { startAt: cue.start * 1000, name: cue.value, channel: MAIN };
});

export const cueEvents: Eventime['events'] = [
	{
		startAt: 0,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 430,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 490,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 550,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 620,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 690,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 760,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 830,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 1040,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 1460,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 1600,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 1810,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 2100,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 2360,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 2440,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 2610,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 2690,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 3020,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 3090,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 3440,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 3790,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 3930,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 4140,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 4510,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 4580,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 4640,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 4710,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 4780,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 5060,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 5130,
		name: 'X',
		channel: MAIN,
	},
	{
		startAt: 5400,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 5510,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 5580,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 5790,
		name: 'G',
		channel: MAIN,
	},
	{
		startAt: 5860,
		name: 'F',
		channel: MAIN,
	},
	{
		startAt: 6070,
		name: 'E',
		channel: MAIN,
	},
	{
		startAt: 6140,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 6220,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 6300,
		name: 'A',
		channel: MAIN,
	},
	{
		startAt: 6380,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 6490,
		name: 'C',
		channel: MAIN,
	},
	{
		startAt: 6560,
		name: 'B',
		channel: MAIN,
	},
	{
		startAt: 6630,
		name: 'X',
		channel: MAIN,
	},
];

export const sound_23_04 = {
	type: SoundType.SOUND,
	initial: { src: '/023_04.ogg', track: TRACK_PLAY },
	actions: {
		start_sound_23_04: { action: 'start' },
		end_sound_23_04: { action: 'end' },
	},
} as const;
