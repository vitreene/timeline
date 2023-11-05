import { Tween } from './tween';
import { Display } from './display';

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
	SoundAction,
} from '../../types';
import { Strap } from '../strap/strap';
import { Counter } from '../strap/counter';
import { Layer } from '../display/layer';
import { Sound } from './sound';

const transitionType = {
	TRANSITION: 'transition',
	STRAP: 'strap',
};

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

export class Actionner {
	display: Display;
	seekMode = false;
	state: StateAction = new Map();
	actions: PersosAction = new Map();
	transitions = new Map<TransitionId, Tween | Strap>();
	sounds: Sound;

	constructor(display: Display, sounds: Sound) {
		this.display = display;
		this.sounds = sounds;
	}

	add = (id: PersoId, actions: PersoAction) => {
		// les actions entrantes remplacent les précédentes, pas de fusion
		const newActions = { ...this.actions.get(id), ...actions };
		this.actions.set(id, newActions);
	};

	update = ({
		// time,
		delta,
		name,
		data,
		seek = false,
	}: {
		// time: number;
		delta: number;
		name: string;
		seek: boolean;
		data?: any;
	}) => {
		this.setSeekMode(seek);

		this.actions.forEach((actions, id) => {
			if (!actions[name]) return;
			if (this.sounds.store.has(id)) {
				this.sounds.update(id, actions[name] as SoundAction, delta);
			}
			const perso = this.display.persos.get(id);

			const currentAction = mixActions(actions[name] as Action, data);

			const { transition = null, strap = null, style = null, className = '', ...action } = currentAction;

			if (transition) {
				const key = { id, type: transitionType.TRANSITION, name };
				const tween = new Tween({ perso, transition });
				if (seek) this.updateTween(key, tween, delta);
				this.transitions.set(key, tween);
			}

			if (strap) {
				const key = { id, type: transitionType.STRAP, name };
				this.straps({ key, strap, delta, seek, perso });
			}

			if (style) {
				this.mixStyle(id, style);
			}

			if (className) {
				this.mixClassList(id, className);
			}

			const attrs = this.state.get(id);
			this.state.set(id, { ...attrs, ...action });

			if (action.move) {
				const move = action.move;

				// si traité ici, ne fonctionne plus dans initial
				// une version simplifiée pourrait exister pour initial

				/* 
				move : true -> crée une transition de la position actuelle à la nouvelle, par exemple si le déplacement est justifié par un changement de classes
				*/
				if (typeof move === 'boolean') {
					const oldRect = perso.node.getBoundingClientRect();
					// mettre à jour le perso
					this.display.render(perso, this.state.get(id));
					const newRect = perso.node.getBoundingClientRect();

					const from = {
						x: (oldRect.x - newRect.x) / this.display.zoom,
						y: (oldRect.y - newRect.y) / this.display.zoom,
						width: oldRect.width / this.display.zoom,
						height: oldRect.height / this.display.zoom,
					};

					const style = {
						...from,
						position: 'absolute' as const,
					};
					this.display.render(perso, { style });

					const to = {
						x: 0,
						y: 0,
						width: newRect.width / this.display.zoom,
						height: newRect.height / this.display.zoom,
					};
					const onComplete = () => {
						console.log('onComplete');
						const action = this.state.get(id);
						this.state.set(id, {
							...action,
							style: { ...action.style, position: undefined, width: undefined, height: undefined },
						});
					};
					const key = { id, type: transitionType.TRANSITION, name: 'move' };
					const tween = new Tween({
						perso,
						transition: { from, to, duration: 500, onComplete, ease: ['easeOut', { x: 'backOut' }] },
					});
					if (seek) this.updateTween(key, tween, delta);
					this.transitions.set(key, tween);
				} else {
					const parentId = typeof move === 'string' ? move : move.to;
					const layer = this.display.persos.get(parentId)?.child;

					if (layer instanceof Layer) {
						parentId && (perso.parent = parentId);
						const order = typeof move === 'object' ? move.order : undefined;
						layer.add(perso.node, order);
						layer.update(layer.content);
					}
				}
			}
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
	/* TODO
	- register strap
	- dispatch strap
	- vérifier si le strap existe 
	*/
	straps = ({ key, strap: { type, initial }, delta, seek, perso }: StrapsProps) => {
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
		const action = this.state.get(key.id);
		update.value && this.state.set(key.id, { ...action, ...update.value });
		if (update.done) {
			// transition.onComplete && transition.onComplete();
			this.transitions.delete(key);
		}
	};

	updateTween = (key: TransitionId, transition: Tween, delta: number) => {
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

	mixClassList(id: PersoId, className: ActionClassList | string) {
		const persoState = this.state.get(id) || {};
		const action = mergeClassList(persoState, className);
		this.state.set(id, action);
	}

	flush = () => {
		// TODO ajouter un override pour garantir qu'un élément à ajouter/retirer en priorité le soit ? -> voir onComplete
		// eviter le syndrome !important
		if (this.state.size) {
			this.display.renderer(this.state);
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
	const style = mergeStyle(actionA?.style, actionB?.style);
	const action: Action = {
		...actionB,
		...actionA,
		...(Object.keys(style).length > 0 && { style }),
		className: mergeClassList(actionA, actionB?.className).className,
	};
	return action;
}
