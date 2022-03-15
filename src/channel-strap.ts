import * as straps from './straps';
import { ChannelName, Eventime } from './types';
import { Channel, ChannelOptions, ChannelProps } from './channel';
import { CbStatus } from './clock';

type Fct = (args: any) => any;

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, { Strap: any; invalid: boolean }>();

	init = () => {
		const options = {
			timer: this.timer,
		};
		Object.defineProperty(options, 'store', {
			get: function () {
				return this.store;
			}.bind(this),
		});
		for (const strap in straps) this.registerStrap(straps[strap], options);
	};

	registerStrap = (_Strap, options) => {
		const Strap = new _Strap({ ...options, addEvent: this._addEvent });
		console.log('Strap registered :', Strap.name);
		this.strap.set(Strap.name, { Strap, invalid: false });
	};

	_addEvent = (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		if (status.action === 'play') {
			const event = {
				startAt: status.nextTime,
				..._event,
			};
			this.addEvent(event);
		}
	};

	run({ name, time, status }: ChannelProps): void {
		// invalider avec time, pour employer plusieurs instances
		if (this.strap.has(name)) {
			const { invalid, Strap } = this.strap.get(name);
			if (!invalid) {
				Strap.init();
				this.strap.set(name, { Strap, invalid: true });
			}
		}
	}
}
