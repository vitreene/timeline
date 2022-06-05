import type { Eventime } from 'src/types';
import type { QueueActions } from 'src/queue';
import type { CbStatus, Timer } from 'src/clock';
import type { PersoStore } from 'src/render/create-perso';

export interface StrapProps {
	// name: string;
	store: PersoStore;
	timer: Timer;
	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	next: (event: Eventime, status: CbStatus) => void;
}

export class Strap {
	store: PersoStore;
	timer: Timer;
	queue: QueueActions;
	addEvent: (event: Partial<Eventime>, status: CbStatus) => void;
	next: (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => void;

	constructor(options: StrapProps) {
		console.log('Strap', options);

		this.timer = options.timer;
		this.store = options.store;
		this.queue = options.queue;
		this.addEvent = options.addEvent;
		this.next = options.next;
	}

	run = (props, state) => {
		console.warn(`\x1b[34m Strap  \x1b[35m${this.constructor['publicName']} \x1b[34m  must define a "run" property`);
	};
	addStore(store: PersoStore) {
		this.store = store;
	}
}
