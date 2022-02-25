import { Status } from './clock';
import { Action, ChannelName, Eventime } from './types';

interface Store {
	actions: Action[];
}

// interface Channel {

// }

/**
 * @param events Events
 * @param store object
 */

export class Timeline {
	events = new Map();
	channels = new Map();
	constructor() {
		this.run = this.run.bind(this);
	}

	addEvent = (event: Eventime) => {
		this._addE(event);
		if (event.events) event.events.map(this.addEvent);
		else console.log(this.events);
	};
	_addE = (event: Eventime) => {
		if (this.events.has(event.startAt)) {
			const _events = this.events.get(event.startAt);
			_events.add(event.name);
			this.events.set(event.startAt, _events);
		}
		this.events.set(event.startAt, new Set([event.name]));
	};

	addChannel(channel: Channel) {
		this.channels.set(channel.name, channel);
	}

	run({ currentTime }: Partial<Status>) {
		/* 
recoit un time
- cherche dans les events les correspondances
- dispatche les events selon le channel
 */

		if (this.events.has(currentTime)) {
			this.events
				.get(currentTime)
				.forEach((name) =>
					this.channels.forEach((channel) => channel.run(name, { currentTime }))
				);
		}
	}
}

export class Channel {
	name: ChannelName;
	constructor(name: ChannelName) {
		this.name = name;
	}
	run(name: string, event: Status) {
		console.log('Channel', name, event.currentTime);
	}
}
