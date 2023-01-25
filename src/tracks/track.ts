import { DEFAULT_CHANNEL_NAME, PAUSE, PLAY, SEEK } from '../common/constants';
import { ChannelName, Eventime } from '../types';
import type { TrackName, Time, CasualEvent } from './index';

type EventChannel = Map<Time, Set<string>>;
type EventData = Map<Time, Map<number, any>>;
interface TracksProps {
	name: TrackName;
	events: Eventime;
	channels: ChannelName[];
}

type TrackStatement = typeof PLAY | typeof PAUSE | typeof SEEK;

export class TrackComponent {
	name: TrackName;
	times = new Set<Time>();
	data = new Map<string, EventData>();
	events = new Map<ChannelName, EventChannel>();
	nextEvent = new Map<Time, CasualEvent[]>();
	statement: TrackStatement;

	constructor({ name, events, channels }: TracksProps) {
		this.name = name;
		channels.forEach((channel) => this.events.set(channel, new Map()));
		this.addEvent({ track: name, ...events });
	}

	addEvent = (event: Eventime, offset = 0) => {
		this.registerEvent(event, offset);
		if (event.events) event.events.map((e) => this.addEvent(e, event.startAt));
		// else {
		// 	// trier, puis ref unique // optimiser le tri
		// 	this.times = sortUnique(this.times);
		// }
	};

	private registerEvent(event: Eventime, offset: number) {
		const channel = event.channel || DEFAULT_CHANNEL_NAME;
		if (!this.events.has(channel)) {
			console.warn(`Channel ${channel} has not been declared`);
			return;
		}
		const startAt = event.startAt + offset;
		const channelEvent = this.events.get(channel);
		if (channelEvent.has(startAt)) {
			const _events = channelEvent.get(startAt);
			_events.add(event.name);
			channelEvent.set(startAt, _events);
		} else {
			channelEvent.set(startAt, new Set<string>([event.name]));
		}
		this.times.add(startAt);
		this.addData(event, startAt);
	}

	private addData = (event: Eventime, startAt: number) => {
		!this.data.has(event.name) && this.data.set(event.name, new Map());
		const eventData = this.data.get(event.name);
		const data = { ...event.data, track: this.name };
		eventData.set(startAt, data);
	};
}

// ne sert pas ?
export class Track extends TrackComponent {
	// [PLAY]() {
	// 	this.statement = PLAY;
	// }
	// [PAUSE]() {
	// 	this.statement = PAUSE;
	// }

	// [SEEK](time: number) {
	// 	this.statement = SEEK;
	// }

	onEnter() {
		console.log(`Track ${this.name} entered`);
	}
	onExit() {
		console.log(`Track ${this.name} exited`);
	}
}
