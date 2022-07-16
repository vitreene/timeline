import { Track } from './track';
import { Timer } from '../clock';

import { BACKWARD, channelsName, END_SEQUENCE, FORWARD, TIME_INTERVAL } from '../common/constants';

import type { Options } from './timeline';
import type { CbStatus, Status } from '../clock';
import type { RunEvent } from '../channels/channel';
import type { ChannelName, Eventime } from '../types';

export type Time = number;
export type TrackName = string;
export type AddEvent = TrackManager['addEvent'];
export type CasualEvent = [string, Eventime];

type ClockName = string;
type ControlName = string;
type RunEvents = Record<ChannelName, RunEvent[]>;
interface TrackManagerCurrentProps {
	data: Track['data'];
	events: Track['events'];
	nextEvent: Track['nextEvent'];
}
interface ControlAction {
	clock: ClockName;
	active: TrackName[];
	inactive: TrackName[];
	refTrack?: string;
}
export const Clock = new Timer({ endsAt: END_SEQUENCE });

export class TrackManager {
	// track par défaut où sont rajoutés les events dynamiques
	refTrack: string;
	// données importées : un par track
	tracks = new Map<TrackName, Track>();
	// control en cours
	controlName: ControlName;
	// elements générés : un par controleur
	times = new Map<ControlName, Time[]>();
	runs = new Set<(status: CbStatus) => void>();

	// à deprecier
	// collection : Clock.status
	refClock: ClockName;
	clock = new Map<ClockName, CbStatus>();
	current = new Map<TrackName, TrackManagerCurrentProps>();

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
			const events = tracks[name];
			const track = new Track({ name, events, channels });
			const timer = Object.assign({}, events.duration && { duration: events.duration });
			this.tracks.set(name, track);
			Clock.addTimer(name, timer);
		}
	}

	addEvent(event_: Eventime) {
		const trackName = event_.track || this.refTrack;
		const startAt = event_.hasOwnProperty('startAt') ? event_.startAt : Clock.status.currentTime + TIME_INTERVAL;
		const event = { ...event_, track: trackName, startAt };
		console.log('TM addEvent', trackName, startAt, event.data?.content);
		this.tracks.has(trackName) && this.tracks.get(trackName).addEvent(event);
		let times = this.times.get(this.controlName);
		if (times) {
			times.push(startAt);
			times = sortUnique(times);
		}
	}

	private setClockStatus(control: ControlName, action: ControlAction) {
		const newStatus = this.clock.has(action.clock) ? this.clock.get(action.clock) : undefined;
		const oldStatus = Clock.swap(newStatus as Status);
		this.refClock && this.clock.set(this.refClock, oldStatus);
		this.refClock = action.clock;

		console.log('SWAP CLOCK', this.refClock, newStatus?.currentTime, oldStatus?.currentTime);
	}

	control(control: ControlName, action: ControlAction) {
		this.setClockStatus(control, action);

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

		console.log('————————————————————————————————');
		console.log('TELCO', control, this.current.size);
		console.log('————————————————————————————————');
		this.current.forEach((track, name) => {
			console.log(track.events);

			// track.nextEvent.forEach(([nextEvent, value]) => {
			// 	console.log(name, value, nextEvent);
			// });
		});
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
		console.log('GET EVENTS', status.trackName);

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
