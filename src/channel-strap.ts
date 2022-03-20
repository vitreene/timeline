import * as straps from './straps';
import { ChannelName, Eventime } from './types';
import { Channel, ChannelOptions, ChannelProps } from './channel';
import { CbStatus } from './clock';

type Fct = (args: any) => any;

const testData = { duration: 3000, reaction: { win: true } };

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, any>();

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

	registerStrap = (straps) => {
		const options = { timer: this.timer, addEvent: this._addEvent };
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
		if (status.action === 'play') {
			const event = {
				startAt: status.nextTime,
				..._event,
			};
			this.addEvent(event);
		}
	};

	_next = (name: string) => (_event: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		if (status.action === 'play') {
			const event: Eventime = {
				startAt: status.nextTime,
				..._event,
			};
			this.next(event, name);
		}
	};
	/* 
revoir strap :
- instancer Class à Register
- strap.run(action, state) : le state est externe et passé par l'appel précédent
- si pas de state = init
- il y a une fonction d'appel à chaque tick avec l'état précédent, qui n'est pas déclenché si la lecture ne passe plus sur cette valeur.
- un appel peut renvoyer un event qui sera ajouté.


*/
	run({ name, time, status, data }: ChannelProps): void {
		//TODO cache
		// if ((this.strap.has(name) && this.strap.get(name).has(time)) || !this.strap.has(name)) return;

		if (status.action === 'play' && this.strap.has(name)) {
			const Strap = this.strap.get(name);
			Strap.run(status, data);
		}
	}
}
