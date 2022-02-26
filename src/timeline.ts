import { CbStatus, Status } from './clock';
import { ChannelName, Eventime, Store } from './types';

/**
 * @param events Events
 * @param store object
 */

type EventChannel = Map<number, Set<string>>;

export class Timeline {
	defaultChannelName = ChannelName.DEFAULT;
	events = new Map<string, EventChannel>();
	channels = new Map();
	times = [];

	constructor() {
		this.run = this.run.bind(this);
	}

	addEvent = (event: Eventime) => {
		this._addE(event);
		if (event.events) event.events.map(this.addEvent);
		else {
			this.times.sort((a, b) => a - b);
		}
	};
	_addE = (event: Eventime) => {
		const channel = event.channel || this.defaultChannelName;

		if (!this.events.has(channel)) {
			console.warn(`Channel ${channel} has not been declared`);
			return;
		}
		const channelEvent = this.events.get(channel);

		if (channelEvent.has(event.startAt)) {
			const _events = channelEvent.get(event.startAt);
			_events.add(event.name);
			channelEvent.set(event.startAt, _events);
		} else channelEvent.set(event.startAt, new Set<string>([event.name]));
		!this.times.includes(event.startAt) && this.times.push(event.startAt);
	};

	addChannel(channel: Channel) {
		this.channels.set(channel.name, channel);
		this.events.set(channel.name, new Map());
	}

	run(status: CbStatus) {
		const { currentTime, endClock } = status;
		console.log('currentTime', currentTime);

		/* 
recoit un time
- cherche dans les events les correspondances
- dispatche les events selon le channel
 */
		this.channels.forEach(({ name: channel }) => {
			if (!this.events.has(channel)) return;
			const events = this.events.get(channel);
			if (events.has(currentTime)) events.get(currentTime).forEach((name) => this.channels.get(channel).run(name, status));
		});

		if (endClock) {
			this.channels.forEach((channel) => channel.run(null, status));
			console.log('END', currentTime);
			console.log(this.events);
			console.log(this.times);
		}
	}
}

export class Channel {
	name: ChannelName;
	constructor(name: ChannelName) {
		this.name = name;
	}
	run(name: string, event: Status) {
		console.log('Channel', this.name.toUpperCase(), name, event.currentTime);
	}
}

export class PersoChannel extends Channel {
	store: Store;
	constructor(props) {
		super(props);
	}
	addStore(store: Store) {
		this.store = store;
	}
	run(name: string, status: CbStatus) {
		// console.log('PersoChannel', this.name.toUpperCase(), name, status.currentTime);
		// status.endClock && console.log('STORE PersoChannel', this.store);

		for (const perso in this.store) {
			const action = this.store[perso][name];
			action && console.log(perso.toUpperCase(), name, action);
		}
	}
}
