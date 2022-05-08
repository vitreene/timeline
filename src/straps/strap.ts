import { CbStatus, Timer } from 'src/clock';
import { QueueActions } from 'src/queue';
import { Eventime, Store } from 'src/types';

export interface StrapProps {
	// name: string;
	store: Store;
	timer: Timer;
	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	next: (event: Eventime, status: CbStatus) => void;
}

export class Strap {
	store: Store;
	timer: Timer;
	queue: QueueActions;
	addEvent: (event: Partial<Eventime>, status: CbStatus) => void;
	next: (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => void;

	constructor(options: StrapProps) {
		this.timer = options.timer;
		this.store = options.store;
		this.queue = options.queue;
		this.addEvent = options.addEvent;
		this.next = options.next;
	}

	run = (props, state) => {
		console.warn(`\x1b[34m Strap  \x1b[35m${this.constructor['publicName']} \x1b[34m  must define a "run" property`);
	};
}
