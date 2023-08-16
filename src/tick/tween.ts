import { has } from '../common/utils';
import type { Transition, Style, PersoNode } from './types';

/*
class
register effects
compose queue
*/

export class Tween {
	perso: PersoNode;
	duration: number;
	progress: number = 0;
	from: Style;
	to: Style;
	onComplete?: () => void;

	constructor({ perso, transition }: { perso: PersoNode; transition: Transition }) {
		this.perso = perso;
		this.from = transition.from || getFrom(perso, transition);

		this.to = transition.to;
		this.duration = transition.duration || 500;
		transition.onComplete && (this.onComplete = transition.onComplete);
		// console.log(perso.id, perso.style);
		// console.log(this.from, this.to);
	}

	next = (
		delta: number
	): {
		value: Style;
		done: boolean;
	} => {
		this.progress += delta;
		if (this.progress >= this.duration) {
			this.progress = this.duration;
			console.log('DONE', this.to, this.duration);
			return { value: this.to, done: true };
		}

		const update = {} as Style;
		for (const item in this.to) {
			const prop = this.lerp(this.from[item], this.to[item], this.progress / this.duration);
			update[item] = prop;
		}
		// console.log(update);

		return { value: update, done: false };
	};

	lerp(start: number, end: number, amt: number) {
		return (1 - amt) * start + amt * end;
	}
}

function getFrom(perso: PersoNode, transition: Transition) {
	const to = transition.to;
	if (!perso.style) return to;
	const from = {};
	for (const s in to) {
		from[s] = has(perso.style, s) ?? has(perso.initial, s) ?? to[s];
	}
	return from;
}
