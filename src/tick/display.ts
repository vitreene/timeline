/* 
construire et stocker les persos
alimenter le renderer, mettre en dependance?
*/

import { ROOT } from '.';
import { PersosTypes } from './types';

import type { Action, ActionClassList, Initial, PersoId, StateAction, Store } from './types';

interface Perso {
	initial: Partial<Initial>;
	node: HTMLElement;
	nodeInitial: HTMLElement;
}

export class Display {
	app: HTMLElement;
	persos = new Map<PersoId, Perso>();

	constructor(appId: string, store: Store) {
		this.app = document.getElementById(appId);
		for (const id in store) {
			const perso = store[id];
			const initial = perso.initial;
			const node = createPerso(perso.type, { id, ...initial });
			this.render(node, initial);
			const nodeInitial = node.cloneNode(true);
			this.persos.set(id, { initial, node, nodeInitial });
		}
		this.root();
	}

	root = () => {
		const root = this.persos.get(ROOT).node;
		this.app.appendChild(root);
	};

	renderer = (actions: StateAction) => {
		actions.forEach((action, id) => {
			const perso = this.persos.get(id);
			const node = perso.node;
			this.render(node, action);
		});
	};

	render = (node: HTMLElement, action: Action) => {
		// console.log('renderer', action);
		for (const attr in action) {
			switch (attr) {
				case 'content':
					node.textContent = action[attr];
					break;
				case 'action':
					action[attr]();
					break;
				case 'style':
					{
						const style = action[attr];
						for (const s in style) {
							updateStyle(node, s, style[s]);
						}
					}
					break;
				case 'className':
					updateClassList(node, action[attr]);
					break;

				default:
					break;
			}
		}
	};

	reset = () => {
		this.persos.forEach((perso) => {
			// NOTE cela va-t-il fonctionner avec des conteneurs ?
			// les events sont délégués
			perso.node.remove();
			perso.node = perso.nodeInitial.cloneNode(true) as HTMLElement;
		});
		this.root();
	};
}

function createPerso(type: PersosTypes, props: Partial<Initial>) {
	switch (type) {
		case PersosTypes.TEXT:
			return createText(props);

		default:
			break;
	}
}

function createText(props) {
	const node = document.createElement(props.tag || 'div');
	node.id = props.id;
	return node;
}

export function updateClassList(node: HTMLElement, actions: string | ActionClassList) {
	if (typeof actions === 'string') node.classList.add(...actions.split(' '));
	else {
		for (const action in actions) {
			const className = Array.isArray(actions[action]) ? actions[action] : actions[action].split(' ');
			node.classList[action](...className);
		}
	}
}

function updateStyle(node: HTMLElement, item: string, prop: number) {
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
