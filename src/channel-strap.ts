import * as straps from './straps';
import { ChannelName, Store, Transition } from './types';
import { Channel, ChannelOptions, ChannelProps } from './channel';

type Fct = (args: any) => any;
export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, any>();
	// cache = new Map<string, Map<number, any>>();

	constructor(options: ChannelOptions) {
		super(options);
		this.init();
	}

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
	run({ name, time, status }: ChannelProps): void {
		// ne fonctionne pas si c'est un emetteur ?
		if (status.action === 'seek') {
			this.queue.resetState();
			// if (this.cache.has(name) && this.cache.get(name).has(time)) return this.cache.get(name).get(time);
		}
		if (this.strap.has(name)) {
			// !this.cache.has(name) && this.cache.set(name, new Map());
			const Strap = this.strap.get(name);
			// { status, time }
			Strap.init();
			// this.cache.get(name).set(time, result);
			// console.log('run', result);
		}
	}

	registerStrap = (_Strap, options) => {
		const Strap = new _Strap(options);
		console.log('Strap registered :', Strap.name);
		this.strap.set(Strap.name, Strap);
	};
}
