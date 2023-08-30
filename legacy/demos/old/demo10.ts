import { Tracks } from '../tracks';
import { Clock } from '../tracks/timeline';

import { MAIN, STRAP } from '../common/constants';

import type { Eventime } from '../types';

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
const Manager = new Tracks(tracks);

Manager.play();
Manager.pause();
Manager.play();
const runs = Manager.getEvents(1000, Clock.status);
console.log(runs);
