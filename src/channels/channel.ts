import type { Timer } from '../clock';
import type { CbStatus } from '../clock';
import type { QueueActions } from '../queue';
import type { ChannelName, Eventime } from '../types';
import type { PersoStore } from '../render/create-perso';

export type ActionName = string;
export interface RunEvent {
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
	next: (name: string, event: Eventime) => void;

	constructor(options: ChannelOptions) {
		this.timer = options.timer;
		options.name && (this.name = options.name);
		if (options.queue) {
			this.queue = options.queue;
			this.timer.subscribeTick(this.queue.flush);
		}
	}

	addStore(store: PersoStore) {
		this.store = store;
	}

	run(props: RunEvent): void {
		console.warn(`\x1b[34m Channel \x1b[35m${this.constructor['name']} \x1b[34m  must define a "run" property`);
	}

	init() {}
	reset() {}
}
