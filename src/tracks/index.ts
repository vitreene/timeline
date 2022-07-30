import { Track } from './track';
import { Timer } from '../clock';

import { BACKWARD, channelsName, END_SEQUENCE, FORWARD, PAUSE, PLAY, SEEK, TIME_INTERVAL } from '../common/constants';

import type { Options } from './timeline';
import type { CbStatus } from '../clock';
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

	runs = new Set<(status: CbStatus) => void>();

	constructor(tracks: Record<TrackName, Eventime>, options: Options) {
		this.refTrack = options.defaultTrackName;
		tracks && this.addTracks(tracks, channelsName);
		this.run = this.run.bind(this);
		Clock.subscribe(this.run);
	}

	run(status: CbStatus) {
		this.runs.forEach((run) => run(status));
	}

	addTracks(tracks: Record<TrackName, Eventime>, channels: ChannelName[]) {
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
		// console.log('TM addEvent', trackName, event_, startAt, event.data?.content);

		const track = this.tracks.get(trackName);
		if (track) {
			track.addEvent(event);
			this.tracks.set(trackName, track);
			track.times.add(startAt);
			track.times = sortUnique(track.times);
		}
	}

	control(control: ControlName, action: ControlAction) {
		this.controlName = control;
		this.refTrack = action.refTrack || action.active[0];

		action.active.forEach((trackName) => {
			const track = this.tracks.get(trackName);
			if (track) {
				// const { events, data, nextEvent } = track;
				track.onEnter();
				Clock.setTimer(trackName, PLAY);
				track.play();
			}
		});
		action.inactive.forEach((trackName) => {
			const track = this.tracks.get(trackName);
			if (track) {
				Clock.setTimer(trackName, PAUSE);
				track.onExit();
				track.pause();
			}
		});

		// LOGS /////////////
		let statements = [];
		Clock.timers.forEach((timer, name) => statements.push(`${name} : ${timer.statement}`));

		console.log('————————————————————————————————');
		console.log('TELCO', control);
		this.tracks.forEach((track, name) => {
			if (track.statement === PLAY) {
				console.log(name, track.events);
			}
		});
		console.log('Clock.timers', statements);
		console.log('————————————————————————————————');
	}

	getNext(status: CbStatus) {
		const casuals = [];
		// console.log('getNext--->', status.seekAction);

		if (status.seekAction === BACKWARD) return casuals;
		status.seekAction === FORWARD && (status.currentTime += TIME_INTERVAL);
		const { currentTime: time } = status;

		// if (status.statement === PLAY) {
		// console.log(status.trackName, status.currentTime, status.statement);
		const track = this.tracks.get(status.trackName);
		if (track) {
			const { nextEvent } = track;
			// status.statement === SEEK && console.log('getNext', time, nextEvent);

			if (nextEvent.has(time)) {
				nextEvent
					.get(time)
					.forEach(([name, event]) => casuals.push({ name, time, status, data: event.data, channel: event.channel }));
				nextEvent.delete(time);
			}
			// }
		}
		return casuals;
	}

	setNext(name: string, event: Eventime) {
		const track = event.track || this.refTrack;

		if (!this.tracks.has(track)) return;
		const time = event.startAt;
		const { nextEvent } = this.tracks.get(track);

		if (!nextEvent.has(time)) nextEvent.set(time, []);
		const casual = nextEvent.get(time);
		casual.push([name, event]);
		// console.log('setNext', time, casual);
	}

	getEvents(time: number, status: CbStatus) {
		// console.log('GET EVENTS', time, status.trackName);

		const runs: Partial<RunEvents> = {};
		this.tracks.forEach((track) => {
			if (track.statement === PLAY) {
				const { events: eventsByChannel, data: dataByChannel } = track;
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
		});
		return runs;
	}

	getSeekEvents(status: CbStatus) {
		const { currentTime, seekTime } = status;

		const trackTimes = this.tracks.get(status.trackName).times;

		const pastTimes = timeBefore(trackTimes, seekTime);
		const forwardTimes = currentTime < seekTime && timeAfter(trackTimes, currentTime, seekTime);

		// console.log('trackTimes', trackTimes);
		// console.log('pastTimes--->', currentTime, pastTimes);
		// console.log('forwardTimes--->', currentTime, forwardTimes);

		const track = this.tracks.get(status.trackName);
		if (!track) return [];

		const pastEvents = applyEvents(pastTimes, track, { ...status, seekAction: BACKWARD });

		const forwardEvents = applyEvents(forwardTimes, track, { ...status, seekAction: FORWARD });

		return [pastEvents, forwardEvents];
	}

	///END CLASS
}
function applyEvents(times: Time[], track: Track, status: CbStatus) {
	if (!times) return undefined;
	const { events: eventsByChannel, data: dataByChannel } = track;
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
	return runs;
}
// sort array of numbers , numbers must be unique
// peut etre optimisée
function sortUnique(numbers: Set<number>): Set<number> {
	const sorted = Array.from(numbers).sort((a, b) => a - b);
	return new Set(sorted);
}

function timeBefore(times: Set<Time>, seekTime: Time) {
	const before: Time[] = [];
	times.forEach((time) => {
		if (time <= seekTime) before.push(time);
	});
	return before;
}

function timeAfter(times: Set<Time>, currentTime: Time, seekTime: Time) {
	const after = [];
	times.forEach((time) => {
		if (time > currentTime && time < seekTime) after.push(time);
	});
	return after;
}

export function timeInInterval(times_: Set<Time>, currentTime: Time, interval = TIME_INTERVAL) {
	const timeIndexes = new Set<Time>();
	const times = [...times_];

	let i = times.findIndex((t) => t === currentTime);

	if (i > -1) {
		while (times[i] < currentTime + interval) {
			times[i] !== undefined && timeIndexes.add(times[i]);
			i++;
		}
	}

	return Array.from(timeIndexes);
}
