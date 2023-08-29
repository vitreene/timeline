import { Clock, TrackName } from '../tracks';
import { createTelco } from './create-telco';
import { Timeline } from '../tracks/timeline';

import { PersoElementType } from '../types';
import { ROOT, MAIN, STRAP, END_SEQUENCE, SEEK } from '../common/constants';

import type { Eventime, Initial, Store } from '../types';

import '../style.css';

const ID01 = 'hello';

const events: Eventime = {
	startAt: 0,
	name: 'initial',
	channel: MAIN,
	duration: 2000,
	events: [
		{ startAt: 400, name: 'enter', channel: MAIN },
		{ startAt: 401, name: 'action01', channel: MAIN },

		{ startAt: 1500, name: 'action02', channel: MAIN },
		{ startAt: 1800, name: 'action03', channel: MAIN, data: { content: 'THE END' } },
	],
};

const initialID01: Partial<Initial> = {
	className: 'initial',
	content: ID01,
	style: { top: 0, left: 0, color: 'blue', position: 'absolute' },
};

const _persos: Store = {
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
					to: { 'font-size': 96, top: 100, left: 400 },
					duration: 1200,
				},
			},
			action03: {
				className: 'action03',
			},
		},
	},
};

const CLOCK_PLAY = 'clockPlay';
const CLOCK_PAUSE = 'clockPause';

const TRACK_PLAY = 'trackPlay';

const tracks = {
	[TRACK_PLAY]: events,
};

const options = {
	defaultTrackName: TRACK_PLAY,
};

const persos = _persos;

// EXECUTE PLAN /////////
type Time = number;

export class Telco extends Timeline {
	start() {
		this.play();
		Clock.start();
	}
	play() {
		const action = {
			active: [TRACK_PLAY],
			inactive: [],
			refTrack: TRACK_PLAY,
			clock: CLOCK_PLAY,
		};
		this.tracks.control('play', action);
	}

	pause() {
		const action = {
			active: [],
			inactive: [TRACK_PLAY],
			refTrack: '',
			clock: CLOCK_PAUSE,
		};
		this.tracks.control('pause', action);
	}

	seek(progress: Time, trackName: TrackName) {
		Clock[SEEK](trackName, progress);
	}

	onTick(fn) {
		Clock.onTick(fn);
	}
}

const control = {
	duration: events.duration || END_SEQUENCE,
	trackName: TRACK_PLAY,
};

const telco = new Telco({ persos, tracks, options });
createTelco(telco, control);

telco.start();
setTimeout(() => telco.pause(), 800);
// setTimeout(() => telco.play(), 1400);
// setTimeout(() => telco.pause(), 2000);
// setTimeout(() => telco.play(), 3500);

// setTimeout(() => {
// 	debugger;
// }, 2000);
