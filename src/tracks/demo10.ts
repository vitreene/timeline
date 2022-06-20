import { MAIN, STRAP, DEFAULT_CHANNEL_NAME } from '../common/constants';
import { Clock } from '../timeline';
import { Eventime } from '../types';
import { Track, Tracks } from '.';

// EXECUTE PLAN
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

const channels = [DEFAULT_CHANNEL_NAME, STRAP];
const TrackPlay = new Track({ name: 'trackPlay', events: playEvents, channels });
const TrackPause = new Track({ name: 'trackPause', events: pauseEvents, channels });
const TrackEnglish = new Track({ name: 'trackEnglish', events: englishEvents, channels });

const Manager = new Tracks([TrackPlay, TrackPause, TrackEnglish]);

Manager.play();
Manager.pause();
Manager.play();
const runs = Manager.getEvents(1000, Clock.status);
console.log(runs);
