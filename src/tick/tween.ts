import { Store } from './store';
import type { Transition } from 'src/types';
import { DeltaFn, div } from '.';

/*
class
register effects
compose queue
*/

export class Tween {
	duration: number;
	progress: number = 0;
	from: any;
	to: any;
	removeTick: () => void;
	ticker: Store<DeltaFn>['store'];
	constructor(delta = 0, transition: Transition, seek = false, ticker: Store<DeltaFn>['store']) {
		this.ticker = ticker;
		this.from = transition.from;
		this.to = transition.to;
		this.duration = transition.duration || 500;

		// console.log('TWEEN', delta >= this.duration, !!seek);
		this.removeTick = this.ticker(this.tick);

		if (delta >= this.duration) {
			this.tick(this.duration);
		} else {
			this.tick(delta);
		}
	}

	tick = (delta: number) => {
		this.progress += delta;

		if (this.progress >= this.duration) {
			this.progress = this.duration;
			this.removeTick();
		}

		// console.log('tick Tween', this.progress / this.duration);
		for (const item in this.to) {
			const prop = this.lerp(this.from[item], this.to[item], this.progress / this.duration);
			this.updateStyle(item, prop);
		}
	};

	lerp(start: number, end: number, amt: number) {
		return (1 - amt) * start + amt * end;
	}
	// seulement cette partie dans raf
	updateStyle = (item: string, prop: number) => {
		console.log('updateStyle', item, prop);
		switch (item) {
			case 'x':
				div.style.setProperty('--translate-x', prop + 'px');
				break;
			case 'y':
				div.style.setProperty('--translate-y', prop + 'px');
				break;
			case 'font-size':
				// console.log('font-size', Math.round(prop));
				div.style.fontSize = prop + 'px';
				break;
			case 'top':
			case 'bottom':
			case 'left':
			case 'right':
				div.style[item] = prop + 'px';
				break;

			default:
				break;
		}
		div.style[item] = prop;
	};
}
