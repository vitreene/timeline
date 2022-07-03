import { Clock } from '../tracks/timeline';
import { CbStatus, Status } from 'src/clock';
import { Options } from './timeline';

import { BACKWARD, channelsName, DEFAULT_CHANNEL_NAME, FORWARD, STRAP, TIME_INTERVAL } from '../common/constants';

import type { ChannelName, Eventime } from '../types';
import { RunEvent } from 'src/channels/channel';

type Time = number;
type TrackName = string;

type EventChannel = Map<Time, Set<string>>;
type EventData = Map<Time, Map<number, any>>;

interface TracksProps {
	name: TrackName;
	events: Eventime;
	channels: ChannelName[];
}
export type AddEvent = TrackManager['addEvent'];

const mapClock = {
	play: 1,
	pause: 2,
	seek: 1,
};

export class Track {
	name: TrackName;
	times: number[] = [];
	data = new Map<string, EventData>();
	events = new Map<ChannelName, EventChannel>();
	nextEvent = new Map<number, CasualEvent[]>();

	constructor({ name, events, channels }: TracksProps) {
		this.name = name;
		channels.forEach((channel) => this.events.set(channel, new Map()));
		this.addEvent({ track: name, ...events });
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
type ClockName = string;
interface TrackManagerCurrentProps {
	data: Track['data'];
	events: Track['events'];
	nextEvent: Track['nextEvent'];
}
type RunEvents = Record<ChannelName, RunEvent[]>;
type CasualEvent = [string, Eventime];

interface ControlAction {
	clock: ClockName;
	active: TrackName[];
	inactive: TrackName[];
	refTrack?: string;
}

export class TrackManager {
	// track par défaut où sont rajoutés les events dynamiques
	refTrack: string;
	// données importées : un par track
	tracks = new Map<TrackName, Track>();
	current = new Map<TrackName, TrackManagerCurrentProps>();

	// control en cours
	controlName: ControlName;
	// elements générés : un par controleur
	times = new Map<ControlName, Time[]>();

	runs = new Set<(status: CbStatus) => void>();

	// collection : Clock.status
	clock = new Map<ClockName, CbStatus>();
	refClock: ClockName;

	constructor(tracks: Record<TrackName, Eventime>, options: Options) {
		this.refTrack = options.defaultTrackName;
		tracks && this.addTrack(tracks, channelsName);
		this.run = this.run.bind(this);
		Clock.subscribe(this.run);
	}

	run(status: CbStatus) {
		this.runs.forEach((run) => run(status));
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

	control(control: string, action: ControlAction) {
		const newRefClock = this.clock.has(action.clock) ? (this.clock.get(action.clock) as Status) : undefined;
		const oldStatus = Clock.swap(newRefClock);
		this.refClock && this.clock.set(this.refClock, oldStatus);
		this.refClock = action.clock;

		this.controlName = control;
		this.refTrack = action.refTrack || action.active[0];
		const times = [];
		action.active.forEach((name) => {
			const track = this.tracks.get(name);
			if (track) {
				const { events, data, nextEvent } = track;
				track.onEnter();
				this.current.set(name, { events, data, nextEvent });
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
		this.times.set(control, sortUnique(times));
	}

	getNext(status: CbStatus) {
		if (status.seekAction === BACKWARD) return;
		status.seekAction === FORWARD && (status.currentTime += TIME_INTERVAL);
		const { currentTime: time } = status;

		const casuals = [];
		this.current.forEach(({ nextEvent }) => {
			if (nextEvent.has(time)) {
				nextEvent
					.get(time)
					.forEach(([name, event]) => casuals.push({ name, time, status, data: event.data, channel: event.channel }));
				nextEvent.delete(time);
			}
		});
		return casuals;
	}

	setNext(name: string, event: Eventime) {
		const track = event.track || this.refTrack;
		if (!this.current.has(track)) return;
		const time = event.startAt;
		const { nextEvent } = this.current.get(track);

		if (!nextEvent.has(time)) nextEvent.set(time, []);
		const casual = nextEvent.get(time);
		casual.push([name, event]);
	}

	getEvents(time: number, status: CbStatus) {
		const runs: Partial<RunEvents> = {};
		this.current.forEach(({ events: eventsByChannel, data: dataByChannel }) => {
			eventsByChannel.forEach((events, channel) => {
				if (!events.size) return;
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

	getSeekEvents(status: CbStatus) {
		const { currentTime, seekTime } = status;
		status.seekAction = currentTime < seekTime ? FORWARD : BACKWARD;

		const pastTimes = timeBefore(this.times.get(this.controlName), seekTime);
		const forwardTimes =
			status.seekAction === FORWARD && timeAfter(this.times.get(this.controlName), currentTime, seekTime);

		const allEvents: Partial<RunEvents>[] = [];
		this.current.forEach(({ events: eventsByChannel, data: dataByChannel }) => {
			[pastTimes, forwardTimes].filter(Boolean).forEach((times) => {
				const runs: Partial<RunEvents> = {};
				for (const time of times) {
					eventsByChannel.forEach((events, channel) => {
						if (!events.size) return;
						if (!runs[channel]) runs[channel] = [];
						if (events.has(time)) {
							events.get(time).forEach((name) => {
								const data = dataByChannel.has(name) && dataByChannel.get(name).has(time) && dataByChannel.get(name).get(time);
								runs[channel].push({ name, time, data, status });
							});
						}
					});
				}
				allEvents.push(runs);
			});
		});
		return allEvents;
	}

	///END CLASS
}

// sort array of numbers , numbers must be unique
// peut etre optimisée
function sortUnique(numbers: number[]): number[] {
	const sorted = numbers.sort((a, b) => a - b);
	const unique = new Set(sorted);
	return Array.from(unique);
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

export function timeInInterval(times: Time[], currentTime: Time, interval = TIME_INTERVAL) {
	const timeIndexes: Time[] = [];
	let i = times.findIndex((t) => t === currentTime);

	if (i > -1)
		while (times[i] < currentTime + interval) {
			times[i] !== undefined && timeIndexes.push(times[i]);
			i++;
		}
	return timeIndexes;
}
