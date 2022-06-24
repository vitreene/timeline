import { Channel } from '../channels/channel';
import { PersoChannel } from '../channels/channel-perso';
import { StrapChannel } from '../channels/channel-strap';
import { Timer } from '../clock';
import { QueueActions } from '../queue';
import { PersoStore } from '../render/create-perso';
import { createRender } from '../render/render-DOM';

import { END_SEQUENCE, DEFAULT_CHANNEL_NAME, ROOT, INIT } from '../common/constants';

import type { Eventime, Store } from '../types';
import { TrackManager } from '.';

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
const channels = [PersoChannel, StrapChannel];
export class Timeline {
	channels = new Map();
	tracks: TrackManager;

	constructor({ persos, tracks, options }: TimelineConfig) {
		this.tracks = new TrackManager(tracks, options);
		const store = createStore(persos, this.tracks.addEvent);
		this._initChannels(store);
		this._addInitialEvents(store);
	}

	private _initChannels(store: PersoStore) {
		const render = createRender(store);
		const queue = new QueueActions(render);
		channels.forEach((Channel) => {
			const channel = new Channel({ queue, timer: Clock });
			channel.addStore(store);
			this.addChannel(channel);
		});
	}

	private _addInitialEvents(store: PersoStore) {
		store.persos.forEach((perso) => {
			perso.actions[INIT] = perso.initial;
		});
		const event: Eventime = {
			channel: DEFAULT_CHANNEL_NAME,
			name: INIT,
			startAt: 0,
		};
		this.tracks.addEvent(event);
	}

	addChannel(channel: Channel) {
		channel.addEvent = this.tracks.addEvent;
		// channel.executeEvent = this.executeEvent.bind(this);
		// channel.next = this.next;
		channel.init();
		this.channels.set(channel.name, channel);
	}
}

// PERSOS////////////
const root = document.getElementById('app');

function createStore(persos: Store, handler) {
	const store = new PersoStore(handler);
	for (const id in persos) {
		const perso = store.add(id, persos[id]);
		// Provisoire
		id === ROOT && root.appendChild(perso.node);
	}
	return store;
}
