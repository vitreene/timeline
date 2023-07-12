import { Store } from './store';
import type { Transition, DeltaFn, MapAction, Style } from './types';

/*
class
register effects
compose queue
*/

export class Tween {
	duration: number;
	progress: number = 0;
	from: Style;
	to: Style;

	constructor({ transition }: { transition: Transition }) {
		this.from = transition.from;
		this.to = transition.to;
		this.duration = transition.duration || 500;
	}

	next = (delta: number) => {
		this.progress += delta;
		if (this.progress >= this.duration) {
			this.progress = this.duration;
			console.log('D9ONE', delta, this.duration);

			return { value: this.to, done: true };
		}

		const update = {} as Style;
		for (const item in this.to) {
			const prop = this.lerp(this.from[item], this.to[item], this.progress / this.duration);
			update[item] = prop;
		}

		return { value: update, done: false };
	};

	lerp(start: number, end: number, amt: number) {
		return (1 - amt) * start + amt * end;
	}
}
