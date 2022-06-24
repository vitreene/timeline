import { Clock } from '../timeline';
import { CbStatus } from 'src/clock';
import { Options } from './timeline';

import { channelsName, DEFAULT_CHANNEL_NAME, STRAP, TIME_INTERVAL } from '../common/constants';

import type { ChannelName, Eventime } from '../types';

type Time = number;
type TrackName = string;

type EventChannel = Map<Time, Set<string>>;
type EventData = Map<Time, Map<number, any>>;

interface TracksProps {
	name: TrackName;
	events: Eventime;
	channels: ChannelName[];
}
const mapClock = {
	play: 1,
	pause: 2,
	seek: 1,
};

export class Track {
	name: TrackName;
	events = new Map<ChannelName, EventChannel>();
	data = new Map<string, EventData>();
	times: number[] = [];

	constructor({ name, events, channels }: TracksProps) {
		this.name = name;
		channels.forEach((channel) => this.events.set(channel, new Map()));
		this.addEvent(events);
	}

	addEvent = (event: Eventime, offset = 0) => {
		this.registerEvent(event, offset);
		if (event.events) event.events.map((e) => this.addEvent(e, event.startAt));
		else {
			// trier, puis ref unique // optimiser le tri
			this.times = sortUnique(this.times);
		}
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
		if (!this.times.includes(startAt)) this.times.push(startAt);
		if (event.data) this.addData(event);
	}

	private addData = (event: Eventime) => {
		!this.data.has(event.name) && this.data.set(event.name, new Map());
		const eventData = this.data.get(event.name);
		eventData.set(event.startAt, event.data);
	};

	onEnter() {
		console.log(`Track ${this.name} entered`);
	}
	onExit() {
		console.log(`Track ${this.name} exited`);
	}
}

type ControlName = string;
type ClockName = number;
interface TrackManagerCurrentProps {
	events: Track['events'];
	data: Track['data'];
}
interface RunEvent {
	name: string;
	time: Time;
	data: any;
	status: CbStatus;
}
type RunEvents = Record<ChannelName, RunEvent[]>;

export class TrackManager {
	// données importées : un par track
	tracks = new Map<TrackName, Track>();
	current = new Map<TrackName, TrackManagerCurrentProps>();

	// elements générés : un par controleur
	times = new Map<ControlName, Time[]>();
	nextEvent;
	// track par défaut où sont rajoutés les events dynamiques
	refTrack: string;

	// collection : Clock.status
	clock = new Map<ClockName, CbStatus>();

	constructor(tracks: Record<TrackName, Eventime>, options: Options) {
		this.refTrack = options.defaultTrackName;
		tracks && this.addTrack(tracks, channelsName);
	}

	addTrack(tracks: Record<TrackName, Eventime>, channels: ChannelName[]) {
		for (const name in tracks) {
			const track = new Track({ name, events: tracks[name], channels });
			this.tracks.set(track.name, track);
		}
	}

	addEvent(event_: Eventime) {
		const track = event_.track || this.refTrack;
		const startAt = event_.hasOwnProperty('startAt') ? event_.startAt : Clock.status.currentTime + TIME_INTERVAL;
		const event = { ...event_, track, startAt };
		console.log('TM addEvent', event);

		this.tracks.has(track) && this.tracks.get(track).addEvent(event);
	}

	control(control: string, action: { active: string[]; inactive: string[]; refTrack?: string }) {
		this.refTrack = action.refTrack || action.active[0];
		const times = [];
		action.active.forEach((name) => {
			const track = this.tracks.get(name);
			if (track) {
				track.onEnter();
				this.current.set(name, { events: track.events, data: track.data });
				times.push(...track.times);
			}
		});
		action.inactive.forEach((name) => {
			const track = this.tracks.get(name);
			if (track) {
				this.current.delete(name);
				track.onExit();
			}
		});
		this.clock.set(mapClock[control], Clock.status);
		this.times.set(control, sortUnique(times));
	}

	getEvents(time: number, status: CbStatus): Partial<RunEvents> {
		const runs = {};
		this.current.forEach(({ events: eventsByChannel, data: dataByChannel }) => {
			eventsByChannel.forEach((events, channel) => {
				if (!runs[channel]) runs[channel] = [];
				if (events.has(time)) {
					events.get(time).forEach((name) => {
						const data = dataByChannel.has(name) && dataByChannel.get(name).has(time) && dataByChannel.get(name).get(time);
						runs[channel].push({ name, time, data, status });
					});
				}
			});
		});
		return runs;
	}
}

const channels = [DEFAULT_CHANNEL_NAME, STRAP];

// sort array of numbers , numbers must be unique
// peut etre optimisée
function sortUnique(numbers: number[]): number[] {
	const sorted = numbers.sort((a, b) => a - b);
	const unique = new Set(sorted);
	return Array.from(unique);
}

function timeInInterval(times: Time[], currentTime: Time, interval = TIME_INTERVAL) {
	const timeIndexes: Time[] = [];
	let i = times.findIndex((t) => t === currentTime);

	if (i > -1)
		while (times[i] < currentTime + interval) {
			times[i] !== undefined && timeIndexes.push(times[i]);
			i++;
		}
	return timeIndexes;
}

function timeBefore(times: Time[], seekTime: Time) {
	const before: Time[] = [];
	for (const time of times) {
		if (time > seekTime) break;
		before.push(time);
	}
	return before;
}

function timeAfter(times: Time[], currentTime: Time, seekTime: Time) {
	const after = [];
	for (const time of times) {
		if (time > currentTime && time < seekTime) after.push(time);
	}
	return after;
}
