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
	StrapType,
} from './types';
import { Strap } from './strap/strap';
import { Counter } from './strap/counter';

/*
class
register actions
register components ?
compose effects ?
*/

const transitionType = {
	TRANSITION: 'transition',
	STRAP: 'strap',
};

interface TransitionId {
	id: string;
	type: string;
	name: string;
}

export class Actionner {
	actions: PersosAction = new Map();
	transitions = new Map<TransitionId, Tween | Strap>();
	tempTransitions = new Map<TransitionId, Tween | Strap>();
	state: StateAction = new Map();
	renderer: Render;
	seekMode = false;

	constructor(display: Display) {
		this.renderer = display.renderer;
	}

	add = (id: PersoId, actions: PersoAction) => {
		// les actions entrantes remplacent les précédentes, pas de fusion
		const newActions = { ...this.actions.get(id), ...actions };
		this.actions.set(id, newActions);
	};

	update = ({
		time,
		delta,
		name,
		data,
		seek = false,
	}: {
		time: number;
		delta: number;
		name: string;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			if (this.seekMode === false) {
				this.seekMode = true;
				this.transitions.clear();
			}
		}
		if (this.seekMode && !seek) {
			this.seekMode = false;
		}

		this.actions.forEach((actions, id) => {
			if (!actions[name]) return;
			const currentAction = mixActions(actions[name] as Action, data);

			const { transition = null, strap = null, style = null, className = '', ...action } = currentAction;

			if (transition) {
				const tween = new Tween({ transition });
				const key = { id, type: transitionType.TRANSITION, name };
				if (seek) this.updateTween(key, tween, delta);
				this.transitions.set(key, tween);
			}

			if (strap) {
				const key = { id, type: transitionType.STRAP, name };
				this.straps(key, strap, delta, seek);
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
	};

	/* TODO
	- register strap
	- dispatch strap
	- vérifier si le strap existe 
	*/
	straps = (key: TransitionId, { type, initial }: StrapType, delta, seek) => {
		const strap = new Counter(initial);
		if (seek) this.updateStrap(key, strap, delta);
		this.transitions.set(key, strap);
	};

	updateTransitions = (delta: number) => {
		// for (const key of this.transitions.keys()) console.log(key);
		this.transitions.forEach((transition, key) => {
			if (transition instanceof Tween) {
				this.updateTween(key, transition, delta);
			}
			if (transition instanceof Strap) {
				this.updateStrap(key, transition, delta);
			}
		});
	};

	updateStrap = (key: TransitionId, transition: Strap, delta: number) => {
		const update = transition.next(delta);
		update.value && this.state.set(key.id, update.value);
		if (update.done) {
			this.transitions.delete(key);
		}
	};

	updateTween = (key: TransitionId, transition: Tween, delta: number) => {
		const update = transition.next(delta);
		this.mixStyle(key.id, update.value);
		if (update.done) this.transitions.delete(key);
	};

	// TODO mixer les intensités de chaque propriété
	mixStyle(id: PersoId, styleB: Style) {
		const action = this.state.get(id);
		const style = mergeStyle(action?.style, styleB);
		this.state.set(id, { ...action, style });
	}

	mixClassList(id: PersoId, className: ActionClassList | string) {
		const persoState = this.state.get(id);
		if (!persoState) return;
		const action = mergeClassList(persoState, className);
		this.state.set(id, action);
	}

	flush = () => {
		if (this.state.size) {
			this.renderer(this.state);
			this.state.clear();
		}
	};
}

function mergeClassList(action: Action, className: ActionClassList | string) {
	// NOTE traiter ce cas en dehors du runtime
	if (typeof className === 'string') {
		className = { add: [className] };
	}
	const persoNewClassName = action?.className || {};
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

function mergeStyle(styleA: Style, styleB: Style) {
	return { ...styleA, ...styleB };
}

/* 
FIXME dans play(), StyleA n'est pas disponible comme après seek()
-> aller chercher le dernier état de style dans le perso dans ce cas
*/
function ___mergeStyle(styleA: Style, styleB: Style): Style {
	if (!styleA) return styleB;
	if (!styleB) return styleA;
	const newStyle = styleA;

	for (const s in styleB) {
		console.log(s, styleA[s], styleB[s]);
		if (s in styleA && typeof styleA[s] === 'number' && typeof styleB[s] === 'number') {
			newStyle[s] = (styleA[s] + styleB[s]) / 2;
		} else newStyle[s] = styleB[s];
	}

	return newStyle;

	// return { ...action, style: { ...action?.style, ...style } };
}

function mixActions(actionA: Action, actionB: Action): Action {
	if (typeof actionA === 'boolean') return actionB;
	const action: Action = {
		...actionB,
		...actionA,
		style: mergeStyle(actionA?.style, actionB?.style),
		className: mergeClassList(actionA, actionB?.className).className,
	};
	return action;
}
