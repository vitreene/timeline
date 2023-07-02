/* 
construire et stocker les persos
alimenter le renderer, mettre en dependance?
*/

import { ROOT } from '.';
import { createPersoBase } from './display/base';
import { Layer } from './display/layer';

import {
	PersosTypes,
	type Action,
	type ActionClassList,
	type PersoId,
	type PersoNode,
	type StateAction,
	type Store,
} from './types';

export class Display {
	app: HTMLElement;
	persos = new Map<PersoId, PersoNode>();

	constructor(appId: string, store: Store) {
		this.app = document.getElementById(appId);
		this.initPersos(store);
		this.root();
	}

	initPersos(store: Store) {
		for (const id in store) {
			const perso = createPersoBase(id, store[id]) as PersoNode;
			this.render(perso, perso.initial);
			this.persos.set(id, perso);
		}
	}

	root = () => {
		const root = this.persos.get(ROOT).node;
		this.app.appendChild(root);
	};

	renderer = (actions: StateAction) => {
		actions.forEach((action, id) => {
			const perso = this.persos.get(id);
			this.render(perso, action);
		});
	};
	b;

	render = (perso: PersoNode, action: Action) => {
		// console.log('renderer', action);
		for (const attr in action) {
			switch (attr) {
				case 'content':
					if (perso.type === PersosTypes.TEXT) {
						perso.child.update(action.content);
					}
					break;
				case 'move': {
					const move = action.move;
					const parentId = typeof move === 'string' ? move : move.to;
					parentId && (perso.parent = parentId);
					const layer = this.persos.get(parentId)?.child;

					if (layer instanceof Layer) {
						const order = typeof move === 'object' ? move.order : undefined;
						layer.add(perso.node, order);
						layer.update(layer.content);
					}
				}

				case 'style':
					{
						const style = action.style;
						for (const s in style) {
							updateStyle(perso.node, s, style[s]);
						}
					}
					break;
				case 'className':
					updateClassList(perso.node, action.className);
					break;
				case 'action':
					action[attr]();
					break;
				default:
					break;
			}
		}
	};

	reset = () => {
		this.persos.forEach((perso, id) => {
			[...perso.node.attributes].forEach((attr) => perso.node.removeAttribute(attr.name));
			perso.node.id = id;
			this.render(perso, perso.initial);
		});
		this.root();
	};
}

export function updateClassList(node: HTMLElement | SVGElement, actions: string | ActionClassList) {
	if (typeof actions === 'string') node.classList.add(...actions.split(' '));
	else {
		for (const action in actions) {
			const className = Array.isArray(actions[action]) ? actions[action] : actions[action].split(' ');
			node.classList[action](...className);
		}
	}
}

function updateStyle(node: HTMLElement | SVGElement, item: string, prop: number) {
	// console.log('updateStyle', item, prop);

	if ('x' === item || 'y' === item) {
		node.style.translate = 'var(--translate-x) var(--translate-y)';
	}
	switch (item) {
		case 'x':
			node.style.setProperty('--translate-x', prop + 'px');
			break;
		case 'y':
			node.style.setProperty('--translate-y', prop + 'px');
			break;
		case 'font-size':
			// console.log('font-size', Math.round(prop));
			node.style.fontSize = prop + 'px';
			break;
		case 'top':
		case 'bottom':
		case 'left':
		case 'right':
			node.style[item] = prop + 'px';
			break;

		default:
			break;
	}
	node.style[item] = prop;
}
