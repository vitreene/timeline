import { renderer } from './renderer';
import { Tween } from './tween';

import type { Render, MapAction, Style } from './types';

// TODO PROVISOIRE

/*
class
register actions
register components ?
compose effects ?
*/

const id = 'id';

export class Actionner {
	actions: MapAction = new Map();
	tweens = new Set<Tween>();
	state: MapAction = new Map();
	renderer: Render = renderer;

	add = (actions: Map<string, any>) => {
		this.actions = new Map([...this.actions, ...actions]);
	};

	update = ({
		id,
		// delta,
		// time,
		name,
		data,
		seek = false,
	}: {
		// delta: number;
		id: string;
		name: string;
		// time: number;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			this.tweens.clear();
		}
		const { transition = null, style = null, ...action } = { ...this.actions.get(name), ...data };

		if (transition) {
			// console.log('transition', time, delta, seek, transition);
			this.tweens.add(new Tween({ transition }));
		}

		if (style) this.mixer(id, style);

		const attrs = this.state.get(id);
		this.state.set(id, { ...attrs, ...action });
	};

	updateTweens = (delta: number) => {
		this.tweens.forEach((tween) => {
			const update = tween.next(delta);
			this.mixer(id, update.value);
			if (update.done) this.tweens.delete(tween);
		});
	};

	mixer(id: string, update: Style) {
		const attrs = this.state.get(id);
		const newAttrs = { ...attrs, style: { ...attrs?.style, ...update } };
		this.state.set(id, newAttrs);
	}

	flush = () => {
		if (this.state.size) {
			this.renderer(this.state);
			this.state.clear();
		}
	};
}
