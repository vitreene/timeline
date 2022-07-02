import { TrackManager } from '.';
import { Timer } from '../clock';
import { channelManager } from '../channels';
import { PersoChannel } from '../channels/channel-perso';
import { StrapChannel } from '../channels/channel-strap';
import { PersoStore } from '../render/create-perso';

import { DEFAULT_CHANNEL_NAME, END_SEQUENCE, INIT, ROOT, SEEK, TIME_INTERVAL } from '../common/constants';

import type { CbStatus } from '../clock';
import type { Channel, RunEvent } from '../channels/channel';
import type { ChannelName, Eventime, Store } from '../types';

type EventChannel = Map<number, Set<string>>;
type EventData = Map<number, Map<number, any>>;
type CasualEvent = [string, Eventime];

type TrackName = string;
type EventTracks = Record<TrackName, Eventime>;
export type ChannelsMap = Map<ChannelName, Channel>;

export const Clock = new Timer({ endsAt: END_SEQUENCE });
export const channelList = [PersoChannel, StrapChannel];

export interface Options {
	defaultTrackName: TrackName;
}
interface TimelineConfig {
	persos: Store;
	tracks?: EventTracks;
	options?: Options;
}
/// SCENELINE
export class Timeline {
	channels: ChannelsMap;
	tracks: TrackManager;

	constructor({ persos, tracks, options }: TimelineConfig) {
		this.run = this.run.bind(this);
		this.seek_ = this.seek_.bind(this);

		this.tracks = new TrackManager(tracks, options);
		const addEvent = this.tracks.addEvent.bind(this.tracks);
		const store = createStore(persos, addEvent);
		this.channels = channelManager(store, addEvent);
		this.tracks.runs.add(this.run);
	}

	private seek_(status: CbStatus) {}

	run(status: CbStatus) {
		if (status.action === SEEK) return this.seek_(status);

		const controlName = this.tracks.controlName;
		const times = this.tracks.times.get(controlName);
		const ti = timeIndexes(times, status.currentTime);

		ti.forEach((time) => {
			const runs = this.tracks.getEvents(time, status);
			for (const channel in runs) {
				this.channels.has(channel as ChannelName) &&
					runs[channel].forEach((run: RunEvent) => this.channels.get(channel as ChannelName).run(run));
			}
		});

		if (status.endClock) this.endClock(status);
	}

	private endClock(status: CbStatus) {
		this.channels.forEach((channel) => channel.run({ name: 'end-clock', time: status.currentTime, status }));
		console.log('//////////END CLOCK/////////////');
		console.log('END', status.currentTime);
		console.log(this.tracks);
		const current = Array.from(this.tracks.current.values());
		console.log(
			'events:',
			current.map(({ events }) => events)
		);
		console.log(
			'data',
			current.map(({ data }) => data)
		);
		// console.log('nextEvent', this.nextEvent);
		console.log('///////////////////////////////');
	}
}

function timeIndexes(times: number[], currentTime: number) {
	const timeIndexes: number[] = [];
	let i = times.findIndex((t) => t === currentTime);

	if (i > -1)
		while (times[i] < currentTime + TIME_INTERVAL) {
			times[i] !== undefined && timeIndexes.push(times[i]);
			i++;
		}
	return timeIndexes;
}

// PERSOS////////////
export type AddEvent = TrackManager['addEvent'];
const root = document.getElementById('app');

function createStore(persos: Store, addEvent: AddEvent): PersoStore {
	addInitialEvents(persos, addEvent);
	const store = new PersoStore(addEvent);
	for (const id in persos) {
		const perso = store.add(id, persos[id]);
		console.log(perso.node);

		// Provisoire
		id === ROOT && root.appendChild(perso.node);
	}
	return store;
}

function addInitialEvents(persos: Store, addEvent: AddEvent) {
	for (const id in persos) {
		persos[id].actions[INIT] = persos[id].initial;
	}
	const event: Eventime = {
		channel: DEFAULT_CHANNEL_NAME,
		name: INIT,
		startAt: 0,
	};
	addEvent(event);
}
