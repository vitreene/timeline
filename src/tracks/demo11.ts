import { Timeline } from './timeline';
import { Clock } from '../timeline';
import { MAIN, ROOT, STRAP } from '../common/constants';

import { Eventime, PersoElementType, Store } from '../types';

const ID01 = 'hello';
const ID02 = 'world';
const ID03 = 'third';

const persos: Store = {
	[ROOT]: {
		type: PersoElementType.LAYER,
		initial: {
			tag: 'div',
			id: ROOT,
			className: 'root',
		},
		actions: {},
	},
	[ID01]: {
		type: PersoElementType.TEXT,
		initial: { className: 'initial', content: ID01, style: { top: 0, left: 0, color: 'blue', position: 'absolute' } },
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
};

const playEvents: Eventime = {
	startAt: 500,
	name: 'play',
	channel: MAIN,
	events: [
		{ startAt: 400, name: 'enter', channel: MAIN },
		{ startAt: 401, name: 'action01', channel: MAIN },
		{ startAt: 500, name: 'action04', channel: MAIN },
	],
};

const pauseEvents: Eventime = {
	startAt: 0,
	name: 'pause',
	channel: STRAP,
	data: { toto: 1 },
};

const englishEvents: Eventime = {
	startAt: 1000,
	name: 'english',
	channel: STRAP,
	data: { tutu: 2 },
};

const tracks = {
	trackPlay: playEvents,
	trackPause: pauseEvents,
	trackEnglish: englishEvents,
};

// EXECUTE PLAN
const Manager = new Timeline({ persos, tracks });

Manager.tracks.play();
Manager.tracks.pause();
// Manager.tracks.play();
const runs = Manager.tracks.getEvents(1000, Clock.status);
console.log(runs);
