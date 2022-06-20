import { Channel } from '../channels/channel';
import { PersoChannel } from '../channels/channel-perso';
import { StrapChannel } from '../channels/channel-strap';
import { Timer } from '../clock';
import { QueueActions } from '../queue';
import { PersoStore } from '../render/create-perso';
import { createRender } from '../render/render-DOM';

import { END_SEQUENCE, DEFAULT_CHANNEL_NAME, ROOT, INIT } from '../common/constants';

import type { Eventime, Store } from '../types';

type EventChannel = Map<number, Set<string>>;
type EventData = Map<number, Map<number, any>>;
type CasualEvent = [string, Eventime];

type EventTracks = Record<string, Eventime>;
type TimelineOptions = {
	persos: Store;
	events?: EventTracks;
};

export const Clock = new Timer({ endsAt: END_SEQUENCE });

export class Timeline {
	channels = new Map();

	constructor({ persos, events }: TimelineOptions) {
		/* 
  comment importer TrackManager ici ?
  */
		const trackManagerAddEvent = () => {};
		const store = createStore(persos, trackManagerAddEvent);
		this._initChannels(store);
		this._addInitialEvents(store);
	}

	private _initChannels(store: PersoStore) {
		const render = createRender(store);
		const queue = new QueueActions(render);
		[PersoChannel, StrapChannel].forEach((Channel) => {
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
		// this._registerEvent(event);
	}

	addChannel(channel: Channel) {
		// channel.addEvent = this.addEvent;
		// channel.executeEvent = this.executeEvent.bind(this);
		// channel.next = this.next;
		channel.init();
		this.channels.set(channel.name, channel);
		// this.events.set(channel.name, new Map());
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
