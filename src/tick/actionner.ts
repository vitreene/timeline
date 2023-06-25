import { Tween } from './tween';
import { Display } from './display';

import type {
	Render,
	Style,
	PersosAction,
	ActionClassList,
	PersoId,
	Action,
	PersoAction,
	StateAction,
	Store,
} from './types';

/*
class
register actions
register components ?
compose effects ?
*/

export class Actionner {
	actions: PersosAction = new Map();
	tweens = new Map<string, Tween>();
	state: StateAction = new Map();
	renderer: Render;

	constructor(store: Store) {
		const display = new Display(store);
		this.renderer = display.renderer;
	}

	add = (id: PersoId, actions: PersoAction) => {
		// les actions entrantes remplacent les précédentes, pas de fusion
		const newActions = { ...this.actions.get(id), ...actions };
		this.actions.set(id, newActions);
	};

	update = ({
		delta,
		// time,
		name,
		data,
		seek = false,
	}: {
		delta: number;
		// time: number;
		name: string;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			this.tweens.clear();
		}

		this.actions.forEach((actions, id) => {
			if (typeof actions[name] === 'boolean') return;
			const currentAction = this.mixActions(actions[name] as Action, data);
			const { transition = null, style = null, className = '', ...action } = currentAction;

			console.log(name, action, data);

			if (transition) {
				this.tweens.set(id, new Tween({ transition }));
			}
			if (style) {
				this.mixStyle(id, style);
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
			this.mixStyle(id, update.value);
			if (update.done) this.tweens.delete(id);
		});
	};

	// TODO mixer les intensités de chaque propriété
	mixStyle(id: PersoId, style: Style) {
		const action = this.state.get(id);
		const newAction = this.mergeStyle(action, style);
		this.state.set(id, newAction);
	}

	mixClassList(id: PersoId, className: ActionClassList | string) {
		const persoState = this.state.get(id);
		if (!persoState) return;
		const action = this.mergeClassList(persoState, className);
		this.state.set(id, action);
	}

	mixActions(actionA: Action, actionB: Action) {
		const action: Action = {
			...actionB,
			...actionA,
			style: this.mergeStyle(actionA, actionB?.style).style,
			className: this.mergeClassList(actionA, actionB?.className).className,
		};
		return action;
	}

	private mergeStyle(action: Action, style: Style) {
		return { ...action, style: { ...action?.style, ...style } };
	}

	private mergeClassList(action: Action, className: ActionClassList | string) {
		if (typeof className === 'string') {
			className = { add: [className] };
		}
		const persoNewClassName = action.className || {};
		for (const action in className) {
			const persoClassName = persoNewClassName?.[action]
				? typeof persoNewClassName[action] === 'string'
					? [persoNewClassName[action]]
					: persoNewClassName[action]
				: [];
			persoNewClassName[action] = persoClassName.concat(className[action]);
		}
		return { ...action, className: persoNewClassName };
	}

	flush = () => {
		if (this.state.size) {
			this.renderer(this.state);
			this.state.clear();
		}
	};
}
