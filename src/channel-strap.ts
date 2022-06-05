import * as straps from './straps';
import { Channel } from './channel';
import { ChannelName } from './types';
import { PLAY, FORWARD, TIME_INTERVAL } from './common/constants';

import type { Eventime } from './types';
import type { CbStatus } from './clock';
import type { PersoStore } from './render/create-perso';
import type { ChannelOptions, ChannelProps } from './channel';

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, any>();

	constructor(options: ChannelOptions) {
		super(options);
		this.registerStrap(straps);
	}

	registerStrap = (straps) => {
		const options = { queue: this.queue, timer: this.timer, addEvent: this._addEvent };
		for (const name in straps) {
			const Strap = straps[name];
			const next = this._next(Strap.publicName);
			const op = Object.assign({}, options, { next });

			this.strap.set(Strap.publicName, new Strap(op));
		}

		console.log('registerStrap', this.strap);
	};

	_addEvent = (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = {
			startAt: status.currentTime + TIME_INTERVAL,
			..._event,
		};
		this.addEvent(event);
	};

	_next = (strapName: string) => (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = { startAt: status.nextTime, ..._event };

		if (status.action === PLAY) {
			this.next(event, strapName);
		}
		if (status.seekAction === FORWARD) {
			this.executeEvent(event, event.name, status);
		}
	};

	run({ name, status, data }: ChannelProps): void {
		if (this.strap.has(name)) {
			const Strap = this.strap.get(name);

			if (status.action === PLAY && status.headTime === status.currentTime) {
				Strap.run(status, data);
			}
			if (status.seekAction === FORWARD) {
				Strap.run(status, data);
			}
		}
	}
	addStore(store: PersoStore) {
		super.addStore(store);
		this.strap.forEach((strap) => strap.addStore(store));
	}
}
