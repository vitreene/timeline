import { Telco } from './telco';
import { createTelco } from './create-telco';
import { preload } from '../preload';

import { PersoElementType as P } from '../types';
import {
	ROOT,
	LAYER01,
	LAYER02,
	MAIN,
	STRAP,
	MAX_ENDS,
	END_SEQUENCE,
	TRACK_PAUSE,
	TRACK_PLAY,
	SOUND,
} from '../common/constants';

import type { Eventime, Initial, Store } from '../types';
import { kid, mouth, tv } from './kid';
import { sound_1_7b_e_01, cueEvents, cueEventsThree } from './1_7b_e_01/1_7b_e_01-phonemes';
import { lipsync, modelWes, talk3d } from './model-threeD-01';

import { wordsMain, wordsEventsThree } from './1_7b_e_01/1_7b_e.mp3-words';

const ID01 = 'hello';
const ID02 = 'world';
const ID03 = 'third';
const SOUND01 = 'son01';

const ID_COUNTER_01 = 'counter01';
const counter01 = {
	id: ID_COUNTER_01,
	duration: 16000,
	start: 16,
	end: 0,
	complete: { lost: 'PERDU', win: 'terminé' },
};

const ID_COUNTER_02 = 'counter02';
const counter02 = {
	id: ID_COUNTER_02,
	duration: 16000,
	start: 0,
	end: 1600,
};

export const events: Eventime = {
	startAt: 0,
	name: 'initial',
	channel: MAIN,
	duration: MAX_ENDS,
	events: [
		{
			startAt: 1000,
			name: 'start_sound_23_04',
			channel: SOUND,
			events: [...cueEvents, ...cueEventsThree, ...wordsMain, ...wordsEventsThree],
		},
		{ startAt: 1000, name: 'start_' + SOUND01, channel: SOUND },
		// { startAt: 4000, name: 'end_' + SOUND01, channel: SOUND },
		{ startAt: 0, name: 'enter', channel: MAIN },
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
	style: { top: 0, right: 0, color: 'orangered', position: 'absolute' },
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
	kid,
	mouth,
	tv,
	sound_23_04: sound_1_7b_e_01, // FIXME l'ordre influe sur le rendu !!!,
	talk3d,
	modelWes,
	lipsync,
	[ROOT]: {
		type: P.LAYER,
		initial: {
			tag: 'div',
			id: ROOT,
			className: 'root',
		},
		actions: {
			action04: {
				transition: {
					from: { 'background-image': 'linear-gradient(45deg, navajowhite, coral)' },
					to: { 'background-image': 'linear-gradient(225deg, navajowhite, coral)' },
					duration: 3000,
					repeat: 6,
					yoyo: true,
				},
			},
		},
	},
	[LAYER02]: {
		type: P.LAYER,
		initial: { className: 'root-layer' },
		actions: {
			enter: { move: ROOT },
		},
	},
	[LAYER01]: {
		type: P.LAYER,
		initial: { className: 'root-layer' },
		actions: { enter: { move: ROOT } },
	},
	[ID01]: {
		type: P.TEXT,
		initial: initialID01,
		actions: {
			enter: {
				move: LAYER02,
				style: { color: 'red' },
				className: 'init-action02',
			},
			action01: {
				style: { 'font-weight': 'bold' },
				className: 'action01',
				transition: {
					from: { 'font-size': 16, top: 0, right: 50, x: 0 },
					to: { 'font-size': 72, top: 100, right: 100, x: -300 },
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
		initial: { ...initialID02, move: LAYER02 },
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
		initial: { ...initialID03, move: LAYER01 },
		actions: {
			action01: {
				style: { 'font-size': 48 },
				className: 'action01-' + ID02,
			},
			['end_' + ID_COUNTER_02]: {
				transition: {
					from: { opacity: 1 },
					to: { opacity: 0 },
					duration: 1000,
				},
			},
			[ID_COUNTER_02]: true, // signifie : j'écoute counter01
		},
	},
	titre: {
		type: P.TEXT,
		initial: {
			style: {
				x: 600,
				y: 530,
				width: 300,
				color: 'white',
				'font-size': 30,
				'font-weight': 'bold',
				'font-family': 'Helvetica',
				'text-align': 'center',
			},
			move: LAYER02,
		},
		actions: {
			text: {
				transition: {
					from: { opacity: 0 },
					to: { opacity: 1 },
					duration: 300,
				},
			},
		},
	},
};

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

preload(persos).then((medias) => {
	const telco = new Telco({ medias, tracks, options });
	createTelco(telco, control);
	telco.start();
});
