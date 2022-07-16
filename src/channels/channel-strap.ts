import * as straps from '../straps';
import { Channel, RunEvent } from './channel';
import { ChannelName } from '../types';
import { PLAY, FORWARD, TIME_INTERVAL } from '../common/constants';

import type { Eventime } from '../types';
import type { CbStatus } from '../clock';
import type { PersoStore } from '../render/create-perso';
import type { ChannelOptions } from './channel';

export class StrapChannel extends Channel {
	name = ChannelName.STRAP;
	strap = new Map<string, any>();

	constructor(options: ChannelOptions) {
		super(options);
		this.registerStrap(straps);
	}

	registerStrap = (straps) => {
		const options = { queue: this.queue, addEvent: this.addEvent_ };
		for (const name in straps) {
			const Strap = straps[name];
			const next = this.next_(Strap.publicName);
			const op = Object.assign({}, options, { next });

			this.strap.set(Strap.publicName, new Strap(op));
		}

		console.log('registerStrap', this.strap);
	};

	addEvent_ = (event_: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = {
			startAt: status.currentTime + TIME_INTERVAL,
			...event_,
		};
		this.addEvent(event);
	};

	next_ = (strapName: string) => (event_: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = { startAt: status.nextTime, ...event_ };
		// console.log('strap next', strapName, status.action, status.currentTime);

		if (status.action === PLAY) {
			this.next(strapName, event);
		}
		if (status.seekAction === FORWARD) {
			this.executeEvent(event.name, event, status);
		}
	};

	run({ name, status, data }: RunEvent): void {
		if (this.strap.has(name)) {
			const strap = this.strap.get(name);

			name === 'move' && console.log({ name, status, data });

			if (status.action === PLAY && status.headTime === status.currentTime) {
				strap.run(status, data);
			}
			if (status.seekAction === FORWARD) {
				strap.run(status, data);
			}
		}
	}
	addStore(store: PersoStore) {
		super.addStore(store);
		this.strap.forEach((strap) => strap.addStore(store));
	}
}
