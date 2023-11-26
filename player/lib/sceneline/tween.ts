import { extractNumbersFromString, mixNumbersInArray } from '~/tween/array-pattern';
import { has } from '../common/utils';
import * as ease from '../tween/easing';
import type { Transition, Style, PersoNode, StyleEntry, LerpStringStyle } from '../../types';

/* 
spérar en deux classes, 
- tween générique acceptant toutes sortes de valeurs
TweenStyle avec arguments perso et transition Style
*/

export class Tween {
	duration: number;
	progress: number = 0;
	from: Record<string, any>;
	to: Record<string, any>;
	yoyo: boolean;
	repeat: number;
	timesRepeat: number;
	onComplete?: () => void;
	ease: (p: number) => number;
	easeValue: Record<string, string> = {};

	constructor(transition: Transition) {
		this.from = transition.from;
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
			this.progress = this.duration;
			const update = this.updateValues;

			if (this.repeat > this.timesRepeat) {
				// console.log('DONE', this.to, this.duration);
				return { value: update, done: true };
			} else {
				this.progress = 0;

				if (this.yoyo) {
					const from = this.to;
					const to = this.from;
					this.from = from;
					this.to = to;
					return { value: update, done: false };
				}
				return { value: update, done: false };
			}
		}
		const update = this.updateValues;
		return { value: update, done: false };
	};

	get updateValues() {
		const update = {} as Style | StyleEntry;

		for (const item in this.to) {
			const t = this.ease(this.progress / this.duration);
			if (this.easeValue[item]) {
				const e = ease[this.easeValue[item]](t);

				update[item] = lerpItem(this.from[item], this.to[item], e);
			} else {
				const prop = lerpItem(this.from[item], this.to[item], t);
				update[item] = prop;
			}
		}
		return update;
	}
}

export class TweenStyle extends Tween {
	perso: PersoNode;
	constructor({ perso, transition }) {
		const fromTo = prepareFromTo(perso, transition);
		super({ ...transition, ...fromTo });
		this.perso = perso;
	}
}

function getFrom(perso: PersoNode, transition: Transition) {
	const to = transition.to;
	if (!perso.style && !perso.transform) return to;
	const from = {};
	for (const s in to) {
		from[s] = has(perso.style, s) ?? has(perso.initial.style, s) ?? has(perso.transform, s) ?? to[s];
	}
	return from;
}

function prepareFromTo(perso: PersoNode, transition: Transition) {
	//FIXME  attention ne vérifie pas un from incomplet !
	const transitionFrom = transition.from || getFrom(perso, transition);
	const from = expandStringValues(transitionFrom);
	const to = expandStringValues(transition.to);
	return { from, to };
}

function expandStringValues(entry: Style) {
	const style = {};
	for (const [prop, value] of Object.entries(entry)) {
		if (typeof value === 'string') {
			const { numbers, pattern } = extractNumbersFromString(value);
			if (numbers.length) {
				style[prop] = { value: numbers, pattern, original: value };
			} else style[prop] = value;
		} else style[prop] = value;
	}
	return style;
}

function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
}

function lerpItem(start: number | LerpStringStyle, end: number | LerpStringStyle, amt: number) {
	if (typeof start === 'number' && typeof end === 'number') return lerp(start, end, amt);
	else if (typeof start === 'object' && typeof end === 'object') {
		const numbers = end.value.map((number, index) => lerp(start.value[index], number, amt));
		return mixNumbersInArray(numbers, end.pattern);
	}
}
