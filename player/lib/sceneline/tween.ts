import { extractNumbersFromString, mixNumbersInArray } from '~/tween/array-pattern';
import { has } from '../common/utils';
import * as ease from '../tween/easing';
import type { Transition, Style, PersoNode, StyleEntry, LerpStringStyle } from './types';

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
		const fromTo = prepareFromTo(perso, transition);
		this.from = fromTo.from;
		this.to = fromTo.to;
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

		const update = {} as Style | StyleEntry;

		for (const item in this.to) {
			const t = this.ease(this.progress / this.duration);
			if (this.easeValue[item]) {
				const e = ease[this.easeValue[item]](t);
				// update[item] = lerp(this.from[item], this.to[item], e);
				update[item] = lerpItem(this.from[item], this.to[item], e);
			} else {
				// const prop = lerp(this.from[item], this.to[item], t);
				const prop = lerpItem(this.from[item], this.to[item], t);
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

function lerpItem(start: number | LerpStringStyle, end: number | LerpStringStyle, amt: number) {
	if (typeof start === 'number' && typeof end === 'number') return lerp(start, end, amt);
	else if (typeof start === 'object' && typeof end === 'object') {
		const numbers = end.value.map((number, index) => Math.round(lerp(start.value[index], number, amt)));
		console.log(numbers);
		return mixNumbersInArray(numbers, end.pattern);
	}
}
