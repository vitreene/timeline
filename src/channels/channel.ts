import { QueueActions } from './queue';
import { CbStatus, Timer } from './clock';

import { ChannelName, Eventime } from './types';
import { PersoStore } from './render/create-perso';

export interface ChannelProps {
	name: string;
	time: number;
	status: CbStatus;
	data?: any;
}

export interface ChannelOptions {
	timer: Timer;
	name?: ChannelName;
	queue?: QueueActions;
}

// timer et store sont injectés par le parent
export class Channel {
	store: PersoStore;
	timer: Timer;
	name: ChannelName;
	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	executeEvent: (event: Eventime, name: string, status: CbStatus) => void;
	next: (event: Eventime, name: string) => void;

	constructor(options: ChannelOptions) {
		this.timer = options.timer;
		options.name && (this.name = options.name);
		if (options.queue) {
			this.queue = options.queue;
			console.log(this.queue);
			this.timer.subscribeTick(this.queue.flush);
		}
	}

	addStore(store: PersoStore) {
		this.store = store;
	}

	run(_props: ChannelProps): void {
		console.warn(`\x1b[34m Channel \x1b[35m${this.constructor['name']} \x1b[34m  must define a "run" property`);
	}

	init() {}
	reset() {}
}
