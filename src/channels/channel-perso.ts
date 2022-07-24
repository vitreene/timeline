import { Channel } from './channel';
import { Transition } from './transition';
import { Layer } from '../render/components/layer';

import { ChannelName } from '../types';
import { FORWARD, PLAY, SEEK } from '../common/constants';

import type { Eventime } from '../types';
import type { CbStatus } from '../clock';
import type { RunEvent, ChannelOptions } from './channel';
import type { Transition as TransitionProps, Move, PersoItem } from '../types';
import { StrapProps } from 'src/straps/strap';

export type ProgressInterpolation = (time: number, start: number, end: number) => FromTo;

export class PersoChannel extends Channel {
	name = ChannelName.MAIN;
	transition: Transition;
	constructor(options: ChannelOptions) {
		super(options);

		console.log('PersoChannel', this.addEvent);

		const props: StrapProps = {
			store: this.store,
			queue: options.queue,
			addEvent: this.addEvent,
			next: this.next_('transition'),
		};

		this.transition = new Transition(props);
	}

	reset(): void {
		this.store.persos.forEach((perso) => perso.reset());
	}

	run({ name, time, status, data }: RunEvent): void {
		if (status.seekAction === FORWARD) return;
		if (status.statement === SEEK) {
			status.currentTime = status.seekTime;
			this.queue.resetState();
		}

		this.store.persos.forEach((perso, id) => {
			const action = perso.actions[name];

			if (action) {
				if (typeof action === 'boolean') {
					this.queue.add(id, data);
				} else {
					const { move, transition, ..._action } = action;
					// transition && this.transition({ id, time, status, transition });
					if (transition) {
						this.transition.addStore(this.store);
						this.transition.run(status, { id, time, transition });
					}
					move && this.move(move, perso);
					this.queue.add(id, { ..._action, ...data });
				}
			}
		});
	}

	runNext({ name, status, data }: RunEvent): void {
		if (name === 'transition') {
			this.transition.run(status, data);
		}
	}

	next_ = (strapName: string) => (event_: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = { startAt: status.nextTime, ...event_ };
		// console.log('PERSO next', strapName, status.statement, status.currentTime);

		if (status.statement === PLAY) {
			// this.tracks.setNext
			this.next(strapName, event);
		}
		if (status.seekAction === FORWARD) {
			this.executeEvent(event.name, event, status);
		}
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
