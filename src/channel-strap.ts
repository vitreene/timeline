import * as straps from './straps';
import { ChannelName, Eventime } from './types';
import { Channel, ChannelOptions, ChannelProps } from './channel';
import { CbStatus } from './clock';
import { PLAY, FORWARD, TIME_INTERVAL } from './common/constants';

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, any>();

	constructor(options: ChannelOptions) {
		super(options);
		this.registerStrap(straps);
	}

	registerStrap = (straps) => {
		const options = { queue: this.queue, timer: this.timer, addEvent: this._addEvent };
		Object.defineProperty(options, 'store', {
			get: function () {
				return this.store;
			}.bind(this),
		});

		for (const name in straps) {
			const Strap = straps[name];
			const next = this._next(Strap.publicName);
			this.strap.set(Strap.publicName, new Strap({ ...options, next }));
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
}
