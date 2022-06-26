import { Timer } from '../clock';
import { QueueActions } from '../queue';
import { PersoStore } from '../render/create-perso';

import type { CbStatus } from '../clock';
import type { ChannelName, Eventime } from '../types';

export type ActionName = string;
export interface ChannelProps {
	name: ActionName;
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
	name: ChannelName;
	store: PersoStore;
	timer: Timer;
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
