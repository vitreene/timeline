import type { Eventime } from 'src/types';
import type { QueueActions } from 'src/queue';
import type { CbStatus } from 'src/clock';
import type { PersoStore } from 'src/render/create-perso';

export interface StrapProps {
	store: PersoStore;
	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	next: (event: Eventime, status: CbStatus) => void;
}

export class Strap {
	store: PersoStore;

	queue: QueueActions;
	addEvent: (event: Partial<Eventime>, status: CbStatus) => void;
	next: (event: Omit<Eventime, 'startAt'>, status: CbStatus) => void;

	constructor(options: StrapProps) {
		this.store = options.store;
		this.queue = options.queue;
		this.next = options.next;
		this.addEvent = options.addEvent;
	}

	run = (props, state) => {
		console.warn(`\x1b[34m Strap  \x1b[35m${this.constructor['publicName']} \x1b[34m  must define a "run" property`);
	};
	addStore(store: PersoStore) {
		this.store = store;
	}
}
