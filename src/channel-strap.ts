import * as straps from './straps';
import { ChannelName, Eventime } from './types';
import { Channel, ChannelOptions, ChannelProps } from './channel';
import { CbStatus } from './clock';

type Fct = (args: any) => any;

const testData = { duration: 3000, reaction: { win: true } };

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, Map<number, any>>();
	collectionStrap = new Map<string, any>();
	_options = {};

	constructor(options) {
		super(options);
		this.registerStrap(straps);
	}
	// init = () => {
	// 	// const options = {
	// 	// 	timer: this.timer,
	// 	// };
	// 	// Object.defineProperty(options, 'store', {
	// 	// 	get: function () {
	// 	// 		return this.store;
	// 	// 	}.bind(this),
	// 	// });
	// 	// for (const strap in straps) this.registerStrap(straps[strap] /* , options */);
	// };

	/* 
	TODO : distinguer les classes et les instances dans deux Map distinctes.
	- la clé de l'instance sera le time
- l'instance est créée à la volée
	-> cela permettra d'utiliser le constructeur 
	*/

	// registerStrap = (Strap /* , options */) => {

	// const Strap = new _Strap({ ...options, addEvent: this._addEvent });
	// console.log('Strap registered :', Strap.name);
	// this.strap.set(Strap.name, { Strap, invalid: false });

	registerStrap = (straps) => {
		this._options = { timer: this.timer, addEvent: this._addEvent };
		Object.defineProperty(this._options, 'store', {
			get: function () {
				return this.store;
			}.bind(this),
		});

		for (const name in straps) {
			const Strap = straps[name];
			this.collectionStrap.set(Strap.publicName, Strap);
		}

		console.log(this.collectionStrap);
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

	run({ name, time, status, data }: ChannelProps): void {
		if ((this.strap.has(name) && this.strap.get(name).has(time)) || !this.collectionStrap.has(name)) return;

		const StrapClass = this.collectionStrap.get(name);
		const Strap = new StrapClass(this._options);

		if (this.strap.has(name)) {
			const straps = this.strap.get(name);
			straps.set(time, Strap);
		} else {
			const straps = new Map();
			straps.set(time, Strap);
			this.strap.set(name, straps);
		}
		Strap.init(data);
	}
}
