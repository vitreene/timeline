import { Channel } from './channel';
import type { RunEvent } from './channel';
import { Layer } from '../render/components/layer';
import { FORWARD, PLAY, SEEK } from '../common/constants';

import { ChannelName } from '../types';
import type { CbStatus } from '../clock';
import type { Transition, Move, PersoItem } from '../types';

export type ProgressInterpolation = (time: number, start: number, end: number) => FromTo;

export class PersoChannel extends Channel {
	name = ChannelName.MAIN;
	reset(): void {
		this.store.persos.forEach((perso) => perso.reset());
	}

	run({ name, time, status, data }: RunEvent): void {
		if (status.seekAction === FORWARD) return;
		if (status.action === SEEK) {
			status.currentTime = status.seekTime;
			this.queue.resetState();
		}

		this.store.persos.forEach((perso, id) => {
			const action = perso.actions[name];

			if (action) {
				if (typeof action === 'boolean') this.queue.add(id, data);
				else {
					const { move, transition, ..._action } = action;
					transition && this.transition({ id, time, status, transition });
					move && this.move(move, perso);
					this.queue.add(id, { ..._action, ...data });
				}
			}
		});
	}

	transitionCache = new Set();
	transition = (props: { id: string; time: number; transition: Transition; status: CbStatus }) => {
		// console.log('transition', props.time, props.status.currentTime);

		const { id, time, transition, status } = props;

		const state = this.queue.stack.get(id) || this.store.getPerso(id).initial;
		const from = (transition.from || state.style) as FromTo;
		const to = transition.to as FromTo;
		const firstStart = time;
		const duration = transition.duration || 0;
		const repeat = transition.repeat || 1;
		const lastEnd = firstStart + duration * repeat;

		const progress: ProgressInterpolation = interpolate({ from, to });
		const inverseProgress: ProgressInterpolation = transition.yoyo && interpolate({ from: to, to: from });

		const doProgress = (status: CbStatus) => {
			const currentTime = status.currentTime - firstStart;
			const elapsed = status.currentTime < lastEnd ? currentTime % transition.duration : transition.duration;

			if (inverseProgress) {
				const yoyo = currentTime % (transition.duration * 2) > transition.duration;
				const iProgress = yoyo ? inverseProgress : progress;
				this.renderTransition(id, iProgress(elapsed, 0, transition.duration));
			} else {
				this.renderTransition(id, progress(elapsed, 0, transition.duration));
			}
		};

		if (status.action !== SEEK && !this.transitionCache.has(props)) {
			this.transitionCache.add(props);
			this.timer.subscribeTick((status) => {
				const onTransition = status.currentTime < lastEnd && status.currentTime >= firstStart;
				if (status.action === PLAY && onTransition) doProgress(status);
			});
		}

		doProgress(status);
	};

	renderTransition = (id: string, result) => {
		const style = {};
		for (const prop in result) {
			const value = typeof result[prop] === 'number' ? Math.round(result[prop] * 100) / 100 : result[prop];
			style[prop] = value;
		}

		this.queue.add(id, { style });
	};

	move = (move: string | Move, perso: PersoItem) => {
		if (typeof move === 'string') {
			const id = move;
			const parent = this.store.getPerso(id).child;
			if (parent instanceof Layer) {
				parent.add(perso.node);
				const content = parent.content;
				this.queue.add(id, { content });
			}
		}
	};
}

export type FromTo = { [x: string]: number };
export type FromToProps = { [x: string]: number | string };

interface InterpolateProps {
	from: FromToProps;
	to: FromToProps;
}

export const interpolate = (props: InterpolateProps) => {
	const { from, to, parses } = prepareInterpolate(props);
	return (time: number, start: number, end: number): FromTo => {
		if (time >= end) return to;
		const progress = (time - start) / (end - start);
		const _result = {};
		for (const p in to) _result[p] = lerp(from[p], to[p], progress);
		const result = postInterpolate(_result, parses);
		return result;
	};
};

function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
}

// from et to sont censés avoir les memes propriétés
function prepareInterpolate(props: InterpolateProps) {
	const from = {};
	const to = {};
	const parses = new Map();

	for (const prop in props.to) {
		const valueTo = props.to[prop];
		const valueFrom = props.from[prop];
		if (typeof valueFrom === 'string' && typeof valueTo === 'string') {
			const arrayTo = parseStringToArray({ [prop]: valueTo });
			const arrayFrom = parseStringToArray({ [prop]: valueFrom });
			if (arrayFrom.textArray.join('') === arrayTo.textArray.join('')) {
				const places = {};
				for (const p in arrayFrom.props) {
					from[p] = arrayFrom.props[p].value;
					to[p] = arrayTo.props[p].value;
					places[p] = arrayFrom.props[p].index;
				}
				const textArray = arrayTo.textArray;
				parses.set(prop, { textArray, places });
			} else {
				console.warn(`les propriétés de ${prop} ne sont pas identiques `);
				console.warn(`props`, arrayFrom.props);
				console.warn(`- from :`, from);
				console.warn(`- to :`, to);
			}
		} else {
			from[prop] = valueFrom;
			to[prop] = valueTo;
		}
	}

	return { from, to, parses };
}

// reconstitue les string a partir du tableau
function postInterpolate(_result, parses) {
	const result = _result;
	parses.forEach(({ textArray, places }, prop: string) => {
		for (const p in places) {
			const index = places[p];
			const value = result[p];
			textArray[index] = Math.round(value * 100) / 100;
			delete result[p];
		}
		result[prop] = textArray.join('');
	});

	return result;
}

/*
pour from et to :
- split string , selon les nombres
- dans le tableau : 
	- identifier les elements qui sont des nombres
	- créer un identifiant : nom de la propriété + nombre ; ex : __color__1
	- creer un tuple identifiant - index
	- remplacer les nombres par leurs identifiants
	join, et comparer les strings, elles doivent etre identiques, sinon warning
	- ajouter les propriétés aux objets from et to 

*/
function parseStringToArray(text: { [k: string]: string }) {
	const [key, val] = Object.entries(text)[0];
	const textArray = val.split(/(\d+\.?\d*)/);

	const props = {};
	textArray.forEach((item, index) => {
		const value = Number(item);
		if (!Number.isNaN(value)) {
			const prop = `__${key}__${index}`;
			props[prop] = { index, value };
			textArray[index] = prop;
		}
	});

	return {
		textArray,
		props,
	};
}

// take numbers form rgb, rgba, hsl, hsla
function parseColor(value: string) {
	const match = value.match(/^(rgb|hsl|hwb)a?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
	console.log('parseColor', value, match);

	// if (!match) throw new Error(`invalid color ${value}`);
	const [, type, r, g, b, a] = match;
	if (type === 'rgb') return { r: parseInt(r), g: parseInt(g), b: parseInt(b) };
	if (type === 'hsl') return { h: parseInt(r), s: parseInt(g), l: parseInt(b) };
	if (type === 'hsla') return { h: parseInt(r), s: parseInt(g), l: parseInt(b), a: parseFloat(a) };
}
