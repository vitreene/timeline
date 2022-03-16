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

	constructor(options: ChannelOptions) {
		this.queue = options.queue;
		this.timer = options.timer;
		this.timer.subscribeTick(this.queue.flush);
		options.name && (this.name = options.name);
	}

	addStore(store: Store) {
		this.store = store;
	}

	run({ name, time, status }: ChannelProps): void {
		console.log('Channel', this.name.toUpperCase(), name, time, status);
	}
	init() {}
}
