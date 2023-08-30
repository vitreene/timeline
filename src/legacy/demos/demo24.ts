import { Telco } from './telco';
import { createTelco } from './create-telco';
import { preload } from '../../preload';

import { PersosTypes as P } from '../../types';
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
	TRACK_ENGLISH,
} from '../../common/constants';

import type { Eventime, Initial, Store } from '../../types';
import { kid, mouth, tv } from './kid';

import { wordsMain } from './1_7b_e_01/1_7b_e.mp3-words';
import { sound_1_7b_e_fr, cueEventsFR } from './1_7b_e_01/1_7b_e_fr-phonemes';
import { sound_1_7b_e_en, cueEventsEN } from './1_7b_e_01/1_7b_e_en-phonemes';
import { wordsMainEN } from './1_7b_e_01/1_7b_e.mp3-words-en';

const ID01 = 'hello';
const ID02 = 'world';
const ID03 = 'third';

const ID_COUNTER_01 = 'counter01';
const counter01 = {
	id: ID_COUNTER_01,
	duration: 16000,
	start: 16,
	end: 0,
	complete: { lost: 'PERDU', win: 'terminé' },
};

const playEvents: Eventime = {
	startAt: 0,
	name: 'initial',
	channel: MAIN,
	duration: MAX_ENDS,
	events: [
		{
			startAt: 1000,
			name: 'start_sound_fr',
			channel: SOUND,
			events: [...cueEventsFR, ...wordsMain],
		},
		{ startAt: 0, name: 'enter', channel: MAIN },
		{ startAt: 401, name: 'action01', channel: MAIN },
		{ startAt: 500, name: 'action04', channel: MAIN },
		{
			startAt: 400,
			name: 'counter',
			channel: STRAP,
			data: counter01,
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
	sound_fr: sound_1_7b_e_fr, // FIXME l'ordre influe sur le rendu !!!,
	sound_en: sound_1_7b_e_en,
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
		initial: { className: 'root-layer', move: ROOT },
		actions: {},
	},
	[LAYER01]: {
		type: P.LAYER,
		initial: { className: 'root-layer', move: ROOT },
		actions: {},
	},
	[ID01]: {
		type: P.TEXT,
		initial: initialID01,
		actions: {
			enter: {
				move: LAYER02,
				style: { color: 'green' },
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
			pause_enter: {
				transition: {
					from: { scale: 1 },
					to: { scale: 1.4 },
					duration: 500,
				},
			},
		},
	},
	titre: {
		type: P.TEXT,
		initial: {
			style: {
				position: 'absolute',
				x: 600,
				y: 530,
				width: 300,
				color: 'white',
				'font-size': 30,
				'font-weight': 'bold',
				'font-family': 'Helvetica',
				'text-align': 'center',
				'z-index': 9999,
			},
			move: { to: LAYER02, order: 'last' },
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
	startAt: 0,
	name: 'initial',
	channel: MAIN,
	duration: MAX_ENDS,
	events: [
		{
			startAt: 1000,
			name: 'start_sound_en',
			channel: SOUND,
			events: [...cueEventsEN, ...wordsMainEN],
		},
	],
};

const tracks = {
	[TRACK_PLAY]: playEvents,
	[TRACK_PAUSE]: pauseEvents,
	[TRACK_ENGLISH]: englishEvents,
};

const options = {
	defaultTrackName: TRACK_PLAY,
};

const persos = _persos;

const control = {
	duration: playEvents.duration || END_SEQUENCE,
	trackName: TRACK_PLAY,
};

preload(persos).then((medias) => {
	const telco = new Telco({ medias, tracks, options });
	createTelco(telco, control);
	telco.start();
});
