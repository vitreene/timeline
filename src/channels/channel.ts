import { StorePersos } from '../render/create-perso';

import type { CbStatus } from '../clock';
import type { QueueActions } from '../queue';
import type { ChannelName, Eventime } from '../types';

export type ActionName = string;
export interface RunEvent {
	name: ActionName;
	time: number;
	status: CbStatus;
	data?: any;
}

export interface ChannelOptions {
	name?: ChannelName;
	queue?: QueueActions;
	addEvent: (event_: Eventime) => void;
}

export class Channel {
	name: ChannelName;
	// store: StorePersos;

	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	next: (name: string, event: Eventime) => void;

	constructor(options: ChannelOptions) {
		options.name && (this.name = options.name);
		options.queue && (this.queue = options.queue);
		this.addEvent = options.addEvent;
	}

	// setStore(store: StorePersos) {
	// 	this.store = store;
	// }

	run(props: RunEvent): void {
		console.warn(`\x1b[34m Channel \x1b[35m${this.constructor['name']} \x1b[34m  must define a "run" property`);
	}
	runNext(props: RunEvent): void {
		this.run(props);
	}

	init() {}
	reset() {}
}
