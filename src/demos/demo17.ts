import { Telco } from './telco';
import { createTelco } from './create-telco';
import { preload } from '../preload';

import { PersoElementType as P } from '../types';
import { ROOT, MAIN, STRAP, END_SEQUENCE, TRACK_PAUSE, TRACK_PLAY, SOUND } from '../common/constants';

import type { Eventime, Initial, Store } from '../types';

const ID01 = 'hello';
const ID02 = 'world';
const ID03 = 'third';
const SOUND01 = 'son01';

const ID_COUNTER_01 = 'counter01';
const counter01 = {
	id: ID_COUNTER_01,
	duration: 2000,
	start: 0,
	end: 10,
	complete: { lost: 'PERDU', win: 'GAGNE' },
};

const ID_COUNTER_02 = 'counter02';
const counter02 = {
	id: ID_COUNTER_02,
	duration: 1500,
	start: 20,
	end: 10,
	complete: { lost: 'LOST', win: 'WON' },
};

export const events: Eventime = {
	startAt: 0,
	name: 'initial',
	channel: MAIN,
	duration: 4000,
	events: [
		{ startAt: 40, name: 'start_' + SOUND01, channel: SOUND },
		{ startAt: 4000, name: 'end_' + SOUND01, channel: SOUND },
		{ startAt: 400, name: 'enter', channel: MAIN },
		{ startAt: 401, name: 'action01', channel: MAIN },
		{ startAt: 500, name: 'action04', channel: MAIN },
		{
			startAt: 400,
			name: 'counter',
			channel: STRAP,
			data: counter01,
		},
		{
			startAt: 900,
			name: 'counter',
			channel: STRAP,
			data: counter02,
		},
		{ startAt: 1500, name: 'action02', channel: MAIN },
		{ startAt: END_SEQUENCE - 300, name: 'action03', channel: MAIN, data: { content: 'THE END' } },
	],
};

const initialID01: Partial<Initial> = {
	className: 'initial',
	content: ID01,
	style: { top: 0, left: 0, color: 'blue', position: 'absolute' },
};

const initialID02: Partial<Initial> = {
	className: 'initial',
	content: ID02,
	style: {
		'background-color': 'orange',
		padding: '1rem',
		color: 'cyan',
		position: 'absolute',
	},
};

const initialID03: Partial<Initial> = {
	className: 'initial',
	content: ID03,
	style: {
		'background-color': 'purple',
		padding: '1rem',
		color: 'yellow',
		position: 'absolute',
		x: 200,
		y: 200,
		width: 400,
		height: 100,
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'font-size': 48,
	},
};

const _persos: Store = {
	[SOUND01]: {
		type: P.SOUND,
		initial: { src: '/music02.m4a', track: TRACK_PLAY },
		actions: {
			['start_' + SOUND01]: { action: 'start' },
			['end_' + SOUND01]: { action: 'end' },
		},
	},
	[ROOT]: {
		type: P.LAYER,
		initial: {
			tag: 'div',
			id: ROOT,
			className: 'root',
		},
		actions: {},
	},
	[ID01]: {
		type: P.TEXT,
		initial: initialID01,
		actions: {
			enter: {
				move: ROOT,
				style: { color: 'red' },
				className: 'init-action02',
			},
			action01: {
				style: { 'font-weight': 'bold' },
				className: 'action01',
				transition: {
					from: { 'font-size': 16, top: 0, left: 0 },
					to: { 'font-size': 72, top: 100, left: 400 },
					duration: 500,
				},
			},
			action03: {
				className: 'action03',
			},
		},
	},
	[ID02]: {
		type: P.TEXT,

		initial: { ...initialID02, move: ROOT },
		actions: {
			action01: {
				style: { 'font-size': 48 },
				className: 'action01-' + ID02,
			},
			['end_' + ID_COUNTER_01]: {
				transition: {
					from: { opacity: 1 },
					to: { opacity: 0 },
					duration: 1000,
				},
			},
			[ID_COUNTER_01]: true, // signifie : j'écoute counter01
		},
	},
	[ID03]: {
		type: P.TEXT,

		initial: { ...initialID03, move: ROOT },
		actions: {
			action01: { className: 'action01-' + ID03 },
			action04: {
				transition: {
					from: { 'background-image': 'linear-gradient(45deg, red, blue)' },
					to: { 'background-image': 'linear-gradient(225deg, red, blue)' },
					duration: 300,
					repeat: 6,
					yoyo: true,
				},
			},
			pause_enter: {
				transition: {
					from: { scale: 1 },
					to: { scale: 1.3 },
					duration: 400,
					repeat: 8,
					yoyo: true,
				},
			},
			// pause_exit: {
			// 	transition: {
			// 		from: { scale: 1.3 },
			// 		to: { scale: 1 },
			// 		duration: 1000,
			// 	},
			// },
			['end_' + ID_COUNTER_02]: {
				transition: {
					from: { rotate: 0 },
					to: { rotate: -12 },
					duration: 1000,
				},
			},
			[ID_COUNTER_02]: true,
		},
		emit: {
			mousedown: {
				channel: STRAP,
				name: 'move',
				data: { event: 'move-event' },
			},
		},
	},
};

// const playEvents: Eventime = {
// 	startAt: 500,
// 	name: 'play',
// 	channel: MAIN,
// 	events: [
// 		{ startAt: 400, name: 'enter', channel: MAIN },
// 		{ startAt: 401, name: 'action01', channel: MAIN },
// 		{ startAt: 500, name: 'action04', channel: MAIN },
// 	],
// };

const pauseEvents: Eventime = {
	startAt: 0,
	name: 'pause',
	channel: STRAP,
	data: { toto: 1 },
	events: [
		{ startAt: 100, name: 'pause_enter', channel: MAIN },
		{ startAt: 1000, name: 'pause_exit', channel: MAIN },
	],
};

const englishEvents: Eventime = {
	startAt: 100,
	name: 'english',
	channel: MAIN,
	data: { tutu: 2 },
};

const TRACK_ENGLISH = 'trackEnglish';
const tracks = {
	[TRACK_PLAY]: events,
	// [TRACK_PLAY]: playEvents,
	[TRACK_PAUSE]: pauseEvents,
	[TRACK_ENGLISH]: englishEvents,
};

const options = {
	defaultTrackName: TRACK_PLAY,
};

const persos = _persos;

const control = {
	duration: events.duration || END_SEQUENCE,
	trackName: TRACK_PLAY,
};

preload(persos).then((p) => {
	const telco = new Telco({ persos: p.persos, audio: p.audio, tracks, options });
	createTelco(telco, control);
	telco.start();
});

// setTimeout(() => telco.pause(), 900);
// setTimeout(() => telco.play(), 1400);
// setTimeout(() => telco.pause(), 2000);
// setTimeout(() => telco.play(), 3500);

// setTimeout(() => {
// 	debugger;
// }, 2000);
