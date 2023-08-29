import { has } from '../common/utils';
import * as ease from '../easing';
import type { Transition, Style, PersoNode } from './types';

export class Tween {
	perso: PersoNode;
	duration: number;
	progress: number = 0;
	from: Style;
	to: Style;
	yoyo: boolean;
	repeat: number;
	timesRepeat: number;
	onComplete?: () => void;
	ease: (p: number) => number;
	easeValue: Record<string, string> = {};

	constructor({ perso, transition }: { perso: PersoNode; transition: Transition }) {
		this.perso = perso;
		this.from = transition.from || getFrom(perso, transition);
		this.to = transition.to;
		this.duration = transition.duration || 500;
		this.timesRepeat = transition.repeat || 1;
		this.repeat = 1;
		this.yoyo = transition.yoyo || false;
		transition.onComplete && (this.onComplete = transition.onComplete);
		this.setEase(transition.ease);
	}

	setEase(easing: Transition['ease'] = 'noop') {
		if (typeof easing === 'string') this.ease = ease[easing];
		else {
			for (const eas of easing) {
				if (typeof eas === 'string') this.ease = ease[eas];
				else {
					this.easeValue = { ...this.easeValue, ...eas };
				}
			}
		}
	}

	next = (
		delta: number
	): {
		value: Style;
		done: boolean;
	} => {
		this.progress += delta;
		if (this.progress >= this.duration) {
			this.repeat++;
			if (this.repeat > this.timesRepeat) {
				this.progress = this.duration;
				console.log('DONE', this.to, this.duration);
				return { value: this.to, done: true };
			} else {
				this.progress = 0;

				if (this.yoyo) {
					const from = this.to;
					const to = this.from;
					this.from = from;
					this.to = to;
					return { value: from, done: false };
				}
				return { value: this.to, done: false };
			}
		}

		const update = {} as Style;
		for (const item in this.to) {
			const t = this.ease(this.progress / this.duration);
			if (this.easeValue[item]) {
				const e = ease[this.easeValue[item]](t);
				update[item] = lerp(this.from[item], this.to[item], e);
			} else {
				const prop = lerp(this.from[item], this.to[item], t);
				update[item] = prop;
			}
		}
		return { value: update, done: false };
	};
}
function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
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
