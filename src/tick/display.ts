/* 
construire et stocker les persos
alimenter le renderer, mettre en dependance?
*/
import { matrix } from '../common/matrix';

import { ROOT } from '.';
import { Layer } from './display/layer';
import { createPersoBase } from './display/base';
import { calculateZoom } from '../common/zoom';
import { addSuffix, stringSnakeToCamel } from '../common/utils';

import { PersosTypes } from './types';

import type { Action, ActionClassList, PersoId, PersoNode, StateAction, PersoStore } from './types';

import { Matrix2D, transformAliases, transformKeys } from './transform-types';

export class Display {
	app: HTMLElement;
	persos = new Map<PersoId, PersoNode>();
	zoom = 1;
	removeResize: () => void;

	constructor(appId: string, store: PersoStore) {
		this.app = document.getElementById(appId);
		this.initPersos(store);
		this.root();
		this.initResize();
	}

	initResize() {
		console.log('initResize');
		window.addEventListener('resize', this.resize);
		this.removeResize = () => window.removeEventListener('resize', this.resize);
		this.resize();
	}

	resize = () => {
		const { zoom } = calculateZoom();
		if (zoom === this.zoom) return;
		this.zoom = zoom;
		console.log('resize', zoom);
		requestAnimationFrame(() =>
			this.persos.forEach((perso: PersoNode) => {
				this.render(perso, { style: perso.style });
				// TODO appliquer le zoom sur les composants enfants
				// if (perso.child.resize) perso.child.resize(this.zoom);
			})
		);
	};

	initPersos(store: PersoStore) {
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
						perso.style = { ...perso.style, ...action.style };
						const style = {};
						const transformProps = {};

						for (const s in action.style) {
							if (transformKeys.includes(s)) transformProps[s] = action.style[s];
							else style[s] = action.style[s];
						}

						const transform = transformStyle(perso, transformProps, this.zoom);
						// console.log(transform);

						updateStyle(perso.node, { transform, ...style }, this.zoom);
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

function transformStyle(perso: PersoNode, transform, zoom) {
	let matrice: Matrix2D[] = [];
	Object.entries({ ...perso.transform, ...transform }).forEach(([key, t]) => {
		const prop = transformAliases[key] || key;
		if (typeof t === 'number') {
			matrice.push(matrix[prop](t));
		}
	});
	if (matrice.length) {
		const combine = matrix.combine(...matrice);
		perso.transform = { ...perso.transform, transform };
		return `matrix(${matrix.getStyleMatrix2d(combine)})`;
	}
}

function updateStyle(node: HTMLElement | SVGElement, style, zoom: number) {
	Object.entries(style).forEach(([key, css]) => {
		const value = addSuffix(key, css, zoom);
		const prop = stringSnakeToCamel(key);
		node.style[prop] = value;
		// prop === 'transform' && console.log(prop, value);
	});
}
