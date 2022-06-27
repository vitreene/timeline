import { Timeline } from './timeline';
import { Clock } from '../tracks/timeline';
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

const CLOCK_PLAY = 'clockPlay';
const CLOCK_PAUSE = 'clockPause';
const TRACK_PLAY = 'trackPlay';
const TRACK_PAUSE = 'trackPause';
const TRACK_ENGLISH = 'trackEnglish';
const tracks = {
	[TRACK_PLAY]: playEvents,
	[TRACK_PAUSE]: pauseEvents,
	[TRACK_ENGLISH]: englishEvents,
};

const options = {
	defaultTrackName: TRACK_PLAY,
};

// EXECUTE PLAN
type Time = number;
export class Telco extends Timeline {
	start() {
		Clock.start();
	}
	play() {
		const action = {
			active: [TRACK_PLAY, TRACK_ENGLISH],
			inactive: [TRACK_PAUSE],
			refTrack: TRACK_PLAY,
			clock: CLOCK_PLAY,
		};

		this.tracks.control('play', action);
		console.log('play', this.tracks.current);
	}

	pause() {
		const action = {
			active: [TRACK_PAUSE],
			inactive: [TRACK_PLAY, TRACK_ENGLISH], //TODO  others
			refTrack: TRACK_PAUSE,
			clock: CLOCK_PAUSE,
		};
		this.tracks.control('pause', action);
		console.log('pause', this.tracks.current);
	}

	_seek_(time: Time) {
		//TODO
	}
}

const Manager = new Telco({ persos, tracks, options });
Manager.start();
Manager.play();
setTimeout(() => Manager.pause(), 500);
setTimeout(() => Manager.play(), 1000);

const runs = Manager.tracks.getEvents(1000, Clock.status);
console.log(runs);
