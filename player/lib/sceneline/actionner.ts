import { Media } from './medias';
import { Display } from './display';
import { TweenStyle } from './tween';

import { Strap, straps } from '../strap';
import { Layer } from '../display/layer';
import { APP } from './constants';

import type {
	Style,
	PersosAction,
	ActionClassList,
	PersoId,
	Action,
	PersoAction,
	StateAction,
	StrapType,
	PersoNode,
	PersoLayer,
	Income,
} from '~/main';
import type { Persos } from './perso';

interface TransitionId {
	id: string;
	type: string;
	name: string;
}
interface StrapsProps {
	key: TransitionId;
	strap: StrapType;
	delta: number;
	seek: boolean;
	perso: PersoNode;
}

/* TODO

traiter les les actions comme des modules 
ex: className.bind(this)
*/
const transitionType = {
	TRANSITION: 'transition',
	STRAP: 'strap',
};

// Dispatcher
export class Actionner {
	persos: Persos;
	medias: Media;
	display: Display;

	seekMode = false;
	state: StateAction = new Map();
	actions: PersosAction = new Map();
	transitions = new Map<TransitionId, TweenStyle | Strap>();

	constructor(persos: Persos, medias: Media) {
		this.display = new Display(APP, persos);

		this.persos = persos;
		this.medias = medias;
		for (const action in this.action) this.action[action] = this.action[action].bind(this);
	}

	add = (id: PersoId, actions: PersoAction) => {
		// les actions entrantes remplacent les précédentes, pas de fusion
		const newActions = { ...this.actions.get(id), ...actions };
		this.actions.set(id, newActions);
	};

	action = {
		transition(id: PersoId, transition: Action['transition'] = null, up: Income) {
			const perso = this.persos.store.get(id);
			const key = { id, type: transitionType.TRANSITION };
			const tween = new TweenStyle({ perso, transition });
			if (up.seek) this.updateTween(key, tween, up.delta);
			this.transitions.set(key, tween);
		},

		strap(id: PersoId, strap: Action['strap'] = null, up: Income) {
			console.log('STRAP', id, strap, up);

			const perso = this.persos.store.get(id);
			const key = { id, type: transitionType.STRAP };
			this.straps({ perso, key, strap, delta: up.delta, seek: up.seek });
		},

		broadcast(id: PersoId, broadcast: Action['broadcast'] = null, up: Income) {
			this.medias.update(id, broadcast, up);
		},
		move: this.move,
		style: this.mixStyle,
		className: this.mixClassList,
	};

	update = (up: Income) => {
		this.setSeekMode(up.seek);
		this.actions.forEach((actions, id) => {
			if (!actions[up.name]) return;
			const currentAction = mixActions(actions[up.name] as Action, up.data);

			const attrs = {};
			for (const typeAction in currentAction) {
				this.action[typeAction]
					? this.action[typeAction](id, currentAction[typeAction], up, this)
					: (attrs[typeAction] = currentAction[typeAction]);
			}

			this.state.set(id, { ...this.state.get(id), ...attrs });
		});
	};

	private setSeekMode = (seek: boolean) => {
		if (seek) {
			if (this.seekMode === false) {
				this.seekMode = true;
				this.transitions.clear();
			}
		}
		if (this.seekMode && !seek) {
			this.seekMode = false;
		}
	};

	updateTransitions = (delta: number) => {
		// for (const key of this.transitions.keys()) console.log(key);
		this.transitions.forEach((transition, key) => {
			if (transition instanceof TweenStyle) {
				this.updateTween(key, transition, delta);
			}
			if (transition instanceof Strap) {
				this.updateStrap(key, transition, delta);
			}
		});
	};

	straps = ({ key, strap: { type, initial }, delta, seek, perso }: StrapsProps) => {
		const strap = straps(type, initial);
		if (!strap) {
			console.warn(`Le strap ${type} n'existe pas.`);
			return;
		}
		if (seek) this.updateStrap(key, strap, delta);
		this.transitions.set(key, strap);
	};

	updateStrap = (key: TransitionId, transition: Strap, delta: number) => {
		const update = transition.next(delta);
		const action = this.state.get(key.id);
		update.value && this.state.set(key.id, { ...action, ...update.value });
		if (update.done) {
			this.transitions.delete(key);
		}
	};

	updateTween = (key: TransitionId, transition: TweenStyle, delta: number) => {
		const update = transition.next(delta);
		this.mixStyle(key.id, update.value);
		if (update.done) {
			this.transitions.delete(key);
			transition.onComplete && transition.onComplete();
		}
	};

	// TODO mixer les intensités de chaque propriété
	mixStyle(id: PersoId, styleB: Style) {
		const action = this.state.get(id);
		const style = mergeStyle(action?.style, styleB);
		this.state.set(id, { ...action, style });
	}

	mixClassList(id: PersoId, className: ActionClassList | string = '') {
		const persoState = this.state.get(id) || {};
		const action = mergeClassList(persoState, className);
		this.state.set(id, action);
	}

	move(id: PersoId, move: Action['move'], up: Income) {
		let target = undefined;
		let order = undefined;
		switch (typeof move) {
			case 'object':
				target = move.to;
				order = move.order;
				break;
			case 'string':
			case 'boolean':
				target = move;
				break;

			default:
				break;
		}
		console.log(id, target);

		this.persos.move({ id, target, order, zoom: this.display.zoom, state: this.state });
	}

	x__move(id: PersoId, move: Action['move'], up: Income) {
		const perso = this.persos.store.get(id);
		const keepStyleProps = {
			width: perso.style?.width,
			height: perso.style?.height,
		};

		const transform = {
			x: perso.style?.x * this.display.zoom || 0,
			y: perso.style?.y * this.display.zoom || 0,
		};

		if (typeof move === 'boolean') {
			const oldRect = perso.node.getBoundingClientRect();
			this.display.render(id, this.state.get(id));

			const newRect = perso.node.getBoundingClientRect();
			const from = applyZoom(
				{
					x: oldRect.x - newRect.x + transform.x,
					y: oldRect.y - newRect.y + transform.y,
					width: oldRect.width,
					height: oldRect.height,
				},
				1 / this.display.zoom
			);

			this.display.render(id, { style: from });

			const to = applyZoom(
				{
					x: 0,
					y: 0,
					width: newRect.width,
					height: newRect.height,
				},
				1 / this.display.zoom
			);

			const onComplete = () => {
				const action = this.state.get(id);
				this.state.set(id, {
					...action,
					style: { ...keepStyleProps, ...action.style },
				});
			};

			const key = { id, type: transitionType.TRANSITION, name: 'move' };
			const tween = new TweenStyle({
				perso,
				transition: { from, to, duration: 2000, onComplete, ease: ['easeOut', { x: 'backOut' }] },
			});

			if (up.seek) this.updateTween(key, tween, up.delta);
			this.transitions.set(key, tween);

			//
		} else {
			const parentId = typeof move === 'string' ? move : move.to;
			const parent = this.persos.store.get(parentId);
			const layer = (parent as PersoLayer)?.child;

			if (layer instanceof Layer) {
				parentId && (perso.parent = parentId);
				const order = typeof move === 'object' ? move.order : undefined;
				layer.add(perso.node, order);
				layer.update(layer.content);
				up.seek && this.display.render(id, this.state.get(id));
			}
		}
	}

	flush = () => {
		// TODO ajouter un override pour garantir qu'un élément à ajouter/retirer en priorité le soit ? -> voir onComplete
		// eviter le syndrome !important
		if (this.state.size) {
			this.display.renderer(this.state);
			this.state.clear();
		}
	};
	reset() {
		this.state.clear();
		this.transitions.clear();
	}
}

function mergeClassList(action: Action, className: ActionClassList | string) {
	// NOTE traiter ce cas en dehors du runtime
	if (typeof className === 'string') {
		className = { add: className.split(/\s+/).filter(Boolean) };
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

function mixActions(actionA: Action, actionB: Action): Action {
	if (typeof actionA === 'boolean') return actionB;
	const style = mergeStyle(actionA?.style, actionB?.style);
	const action: Action = {
		...actionB,
		...actionA,
		...(Object.keys(style).length > 0 && { style }),
		className: mergeClassList(actionA, actionB?.className).className,
	};
	return action;
}

type KeyT<T extends Record<string, any>> = Record<keyof T, any>;

function applyZoom<KeyT>(obj: KeyT, zoom: number): KeyT {
	const zobj = {} as Record<keyof KeyT, any>;
	for (const p in obj) typeof obj[p] === 'number' ? (zobj[p] = (obj[p] as number) * zoom) : (zobj[p] = obj[p]);
	return zobj;
}
