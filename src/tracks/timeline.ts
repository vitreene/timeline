import { TrackManager } from '.';
import { CbStatus, Timer } from '../clock';
import { QueueActions } from '../queue';
import { PersoStore } from '../render/create-perso';
import { createRender } from '../render/render-DOM';
import { PersoChannel } from '../channels/channel-perso';
import { StrapChannel } from '../channels/channel-strap';

import { END_SEQUENCE, DEFAULT_CHANNEL_NAME, ROOT, INIT, SEEK, TIME_INTERVAL } from '../common/constants';

import { Channel } from '../channels/channel';
import type { ChannelName, Eventime, Store } from '../types';

type EventChannel = Map<number, Set<string>>;
type EventData = Map<number, Map<number, any>>;
type CasualEvent = [string, Eventime];

type TrackName = string;
type EventTracks = Record<TrackName, Eventime>;
export interface Options {
	defaultTrackName: TrackName;
}
interface TimelineConfig {
	persos: Store;
	tracks?: EventTracks;
	options?: Options;
}

export const Clock = new Timer({ endsAt: END_SEQUENCE });

export const channelList = [PersoChannel, StrapChannel];

type ChannelsMap = Map<ChannelName, Channel>;

export class Timeline {
	channels: ChannelsMap;
	// comment propager un nouveau channel  vers Tracks ?
	addChannel: (channel: Channel) => void;
	tracks: TrackManager;

	constructor({ persos, tracks, options }: TimelineConfig) {
		this.tracks = new TrackManager(tracks, options);
		const handler = this.tracks.addEvent.bind(this.tracks);
		const store = createStore(persos, handler);
		const { channels, addChannel } = channelManager(store, handler);
		this.channels = channels;
		this.addChannel = addChannel;
	}

	seek = (status: CbStatus) => {};

	run = (status: CbStatus) => {
		if (status.action === SEEK) return this.seek(status);

		const controlName = this.tracks.controlName;
		const times = this.tracks.times.get(controlName);
		const ti = timeIndexes(times, status.currentTime);

		ti.forEach((time) => this.tracks.getEvents(time, status));

		if (status.endClock) {
			this.channels.forEach((channel) => channel.run({ name: 'end-clock', time: status.currentTime, status }));
			console.log('//////////END CLOCK/////////////');
			console.log('END', status.currentTime);
			console.log(
				'events:',
				this.tracks.current.forEach(({ events }) => events)
			);
			// console.log('times', this.times);
			console.log(
				'data',
				this.tracks.current.forEach(({ data }) => data)
			);
			// console.log('nextEvent', this.nextEvent);
			console.log('///////////////////////////////');
		}
	};
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

/// CHANNELS
function channelManager(store: PersoStore, handler: AddEvent) {
	const channels: ChannelsMap = new Map();

	const render = createRender(store);
	const queue = new QueueActions(render);
	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, timer: Clock });
		channel.addStore(store);
		addChannel(channel);
	});

	function addChannel(channel: Channel) {
		channel.addEvent = handler;
		// channel.executeEvent = this.executeEvent.bind(this);
		// channel.next = this.next;
		channel.init();
		channels.set(channel.name, channel);
	}
	return {
		channels,
		addChannel,
	};
}

// PERSOS////////////
type AddEvent = TrackManager['addEvent'];
const root = document.getElementById('app');

function createStore(persos: Store, handler: AddEvent): PersoStore {
	addInitialEvents(persos, handler);
	const store = new PersoStore(handler);
	for (const id in persos) {
		const perso = store.add(id, persos[id]);

		// Provisoire
		id === ROOT && root.appendChild(perso.node);
	}
	return store;
}

function addInitialEvents(persos: Store, handler: AddEvent) {
	for (const id in persos) {
		persos[id].actions[INIT] = persos[id].initial;
	}
	const event: Eventime = {
		channel: DEFAULT_CHANNEL_NAME,
		name: INIT,
		startAt: 0,
	};
	handler(event);
}
