import * as straps from '../straps';
import { Channel, RunEvent } from './channel';
import { ChannelName } from '../types';
import { PLAY, FORWARD, TIME_INTERVAL, BACKWARD, PAUSE } from '../common/constants';

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
		const startAt = status.currentTime + TIME_INTERVAL;
		const event = { startAt, ...event_ };
		this.addEvent(event);
	};

	next_ = (strapName: string) => (event_: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = { startAt: status.currentTime + TIME_INTERVAL, ...event_ };
		if (status.statement === PLAY) {
			this.next(strapName, event);
		}
	};

	run({ name, status, data }: RunEvent): void {
		if (this.strap.has(name) && status.statement === PLAY) {
			const strap = this.strap.get(name);
			strap.run(status, data);
		}
	}

	//TODO  Il faudrait pouvoir actualiser automatiquement
	setStore(store: PersoStore) {
		super.setStore(store);
		this.strap.forEach((strap) => strap.setStore(store));
	}
}
