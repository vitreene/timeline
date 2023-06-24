import { renderer } from './renderer';
import { Tween } from './tween';

import type { Render, MapAction, Style, PersoAction } from './types';

// TODO PROVISOIRE

/*
class
register actions
register components ?
compose effects ?
*/

export class Actionner {
	actions: PersoAction = new Map();
	tweens = new Map<string, Tween>();
	state: MapAction = new Map();
	renderer: Render = renderer;

	add = (actions: PersoAction) => {
		this.actions = new Map([...this.actions, ...actions]);
	};

	update = ({
		// delta,
		// time,
		name,
		data,
		seek = false,
	}: {
		// delta: number;
		// time: number;
		name: string;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			this.tweens.clear();
		}

		this.actions.forEach((actions, id) => {
			const { transition = null, style = null, ...action } = { ...actions.get(name), ...data };

			if (transition) {
				// console.log('transition', time, delta, seek, transition);
				this.tweens.set(id, new Tween({ transition }));
			}

			if (style) this.mixer(id, style);

			const attrs = this.state.get(id);
			this.state.set(id, { ...attrs, ...action });
		});
	};

	updateTweens = (delta: number) => {
		this.tweens.forEach((tween, id) => {
			const update = tween.next(delta);
			this.mixer(id, update.value);
			if (update.done) this.tweens.delete(id);
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
