import { renderer } from './renderer';
import { Tween } from './tween';

import type { Render, MapAction, Style, PersoAction, ActionClassList, PersoId } from './types';

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
		delta,
		time,
		name,
		data,
		seek = false,
	}: {
		delta: number;
		time: number;
		name: string;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			this.tweens.clear();
		}

		this.actions.forEach((actions, id) => {
			const { transition = null, style = null, className = '', ...action } = { ...actions.get(name), ...data };

			if (transition) {
				this.tweens.set(id, new Tween({ transition }));
			}
			if (style) {
				this.mixer(id, style);
			}
			if (className) {
				this.mixClassList(id, className);
			}

			const attrs = this.state.get(id);
			this.state.set(id, { ...attrs, ...action });
		});

		if (seek) {
			this.updateTweens(delta);
		}
	};

	updateTweens = (delta: number) => {
		this.tweens.forEach((tween, id) => {
			const update = tween.next(delta);
			this.mixer(id, update.value);
			if (update.done) this.tweens.delete(id);
		});
	};

	// TODO mixer les intensités de chaque propriété
	mixer(id: PersoId, update: Style) {
		const attrs = this.state.get(id);
		const newAttrs = { ...attrs, style: { ...attrs?.style, ...update } };
		this.state.set(id, newAttrs);
	}

	mixClassList(id: PersoId, className: ActionClassList | string) {
		if (typeof className === 'string') {
			className = { add: [className] };
		}
		const persoState = this.state.get(id);
		if (!persoState) return;
		const persoNewClassName = persoState.className || {};
		console.log(persoNewClassName);

		for (const action in className) {
			const persoClassName = persoNewClassName?.[action]
				? typeof persoNewClassName[action] === 'string'
					? [persoNewClassName[action]]
					: persoNewClassName[action]
				: [];
			persoNewClassName[action] = persoClassName.concat(className[action]);
		}
		this.state.set(id, { ...persoState, className: persoNewClassName });
	}

	flush = () => {
		if (this.state.size) {
			this.renderer(this.state);
			this.state.clear();
		}
	};
}
