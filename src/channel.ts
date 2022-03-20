import { Status, CbStatus, Timer } from './clock';
import { QueueActions } from './queue';
import { ChannelName, Eventime, Store } from './types';

export interface ChannelProps {
	name: string;
	time: number;
	status: CbStatus;
	data?: any;
}

export interface ChannelOptions {
	queue: QueueActions;
	timer: Timer;
	name?: ChannelName;
}
export class Channel {
	name: ChannelName;
	store: Store;
	timer: Timer;
	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	next: (event: Eventime, name: string) => void;

	constructor(options: ChannelOptions) {
		this.queue = options.queue;
		this.timer = options.timer;
		this.timer.subscribeTick(this.queue.flush);
		options.name && (this.name = options.name);
	}

	addStore(store: Store) {
		this.store = store;
	}

	run(_props: ChannelProps): void {
		console.warn(`\x1b[34m Channel \x1b[35m${this.constructor['name']} \x1b[34m  must define a "run" property`);
	}

	init() {}
}
