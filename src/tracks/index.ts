import { Track } from './track';
import { Timer } from '../clock';

import { channelsName, END_SEQUENCE, FORWARD, PAUSE, PLAY, TIME_INTERVAL } from '../common/constants';

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

interface NextStatus extends RunEvent {
	channel: ChannelName;
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
		for (const trackName in tracks) {
			const events = tracks[trackName];
			const track = new Track({ name: trackName, events, channels });
			const timer = Object.assign({}, events.duration && { duration: events.duration });
			this.tracks.set(trackName, track);
			Clock.addTimer(trackName, timer);
		}
	}

	addEvent(event_: Eventime) {
		const trackName: TrackName = event_.track || this.refTrack;
		const startAt = event_.hasOwnProperty('startAt') ? event_.startAt : Clock.status.currentTime + TIME_INTERVAL;
		const event = { ...event_, track: trackName, startAt };

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

	getNext(status: CbStatus): NextStatus[] {
		const casuals = [];
		const { currentTime: time } = status;
		const track = this.tracks.get(status.trackName);
		if (track) {
			const { nextEvent } = track;
			if (nextEvent.has(time)) {
				nextEvent
					.get(time)
					.forEach(([name, event]) => casuals.push({ name, time, status, data: event.data, channel: event.channel }));
				nextEvent.delete(time);
			}
		}
		return casuals;
	}

	setNext(name: string, event: Eventime) {
		const track = event.track || event.data?.track;
		// console.log('CASUAL', name, track, event);

		if (!this.tracks.has(track)) return;
		const time = event.startAt;
		const { nextEvent } = this.tracks.get(track);

		if (!nextEvent.has(time)) nextEvent.set(time, []);
		const casual = nextEvent.get(time);
		casual.push([name, event]);
		// console.log('CASUAL', casual);
	}

	getEvents(time: number, status: CbStatus) {
		const runs: Partial<RunEvents> = {};
		const track = this.tracks.get(status.trackName);

		if (status.statement !== PAUSE) {
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

		return runs;
	}

	getSeekEvents(status: CbStatus) {
		const trackTimes = this.tracks.get(status.trackName).times;
		const pastTimes = timeBefore(trackTimes, status.seekTime);
		const track = this.tracks.get(status.trackName);
		if (!track) return [];
		const pastEvents = applyEvents(pastTimes, track, status);
		return pastEvents;
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
