import type { Eventime } from 'player/src/types';
import type { QueueActions } from 'legacy/queue';
import type { CbStatus } from 'legacy/clock';
import type { StorePersos } from 'legacy/render/create-perso';

export interface StrapProps {
	store: StorePersos;
	queue: QueueActions;
	addEvent: (event: Eventime) => void;
	next: (event: Eventime, status: CbStatus) => void;
}

export class Strap {
	store: StorePersos;
	publicName: string;
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
		console.warn(
			`\x1b[34m Strap  \x1b[35m${this.constructor['publicName']} \x1b[34m  must define a "run" property`
		);
	};
	setStore(store: StorePersos) {
		this.store = store;
	}
}
