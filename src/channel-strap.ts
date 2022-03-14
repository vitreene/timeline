import * as straps from './straps';
import { ChannelName, Eventime } from './types';
import { Channel, ChannelOptions, ChannelProps } from './channel';
import { CbStatus } from './clock';

type Fct = (args: any) => any;

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, any>();

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
		this.strap.set(Strap.name, Strap);
	};

	_addEvent = (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		if (status.action === 'play') {
			const event = {
				startAt: status.currentTime + 100,
				..._event,
			};
			this.addEvent(event);
		}
	};

	run({ name, time, status }: ChannelProps): void {
		// ne fonctionne pas si c'est un emetteur ?

		if (this.strap.has(name)) {
			const Strap = this.strap.get(name);
			Strap.init();
		}
	}
}
