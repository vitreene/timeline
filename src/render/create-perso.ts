import { calculateZoom } from './zoom';
import { createContent } from './components';
import { resolveStyles } from './resolve-styles';

import type { AddEvent } from '../tracks';

import type { Action, PersoItem, PersoNode, PersoThr3dSceneItem } from '../types';
import { Layer } from './components/layer';

export interface HandlerEmit {
	e: Event;
	type: Event['type'];
	id: string;
}

export type StorePersoItems = Map<string, PersoItem | PersoThr3dSceneItem>;

export class StorePersos {
	persos: StorePersoItems = new Map();
	persosByType: Map<string, string[]> = new Map();
	zoom = 1;
	removeResize: () => void;
	handler: AddEvent = null;

	constructor(handler: AddEvent) {
		this.handler = handler;
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
			this.persos.forEach((perso: PersoItem) => {
				perso.update({ style: perso.style });
				if (perso.child.resize) perso.child.resize(this.zoom);
			})
		);
	};

	addAll(persos: Map<string, PersoNode>) {
		persos.forEach((perso, id) => {
			this.add(id, perso);
		});
	}

	add(id: string, perso_: PersoNode) {
		const perso = this.createPerso(id, perso_);
		this.persos.set(id, perso);
		const type = perso_.type as string;
		const list = this.persosByType.get(type);
		if (list) {
			list.push(id);
			this.persosByType.set(type, list);
		} else {
			this.persosByType.set(type, [id]);
		}
		return perso;
	}

	update(id: string, update: Partial<Action>) {
		const perso = this.persos.get(id);
		if (perso) {
			perso.update(update);
		}
	}

	getPerso(id: string) {
		return this.persos.has(id) ? this.persos.get(id) : null;
	}

	getPersosbyType(type: string) {
		const list = this.persosByType.get(type);
		if (list) {
			const persosByType: StorePersoItems = new Map(
				list.map((id) => {
					return [id, this.persos.get(id)];
				})
			);
			return persosByType;
		}
	}

	handleEvent = (event) => {
		console.log(event.type);
		// console.log(event);
		console.log(event.target.dataset.id);

		const persoId = event.target.dataset.id;
		const perso = this.persos.get(persoId);
		const emit = perso.emit[event.type];

		emit.data = { ...emit.data, emit: { e: event, type: event.type, id: event.target.dataset.id } };

		emit && this.handler(emit);
	};

	private createPerso(id: string, { type, initial, actions, emit }: PersoNode) {
		const { tag, ...initial_ } = initial;
		const node = document.createElement(tag || 'div');
		node.id = id;
		const child = createContent(type, { parentNode: node, initial });

		const perso: PersoItem = {
			id,
			type,
			node,
			child,
			initial,
			actions,
			prec: {},
			transform: {},
			style: initial.style || {},
			parent: undefined,
			reset,
			update,
			//add/remove/Listener ?
		};

		if (emit) {
			node.dataset.id = id;
			for (const ev in emit) {
				node.addEventListener(ev, this);
			}
			perso.emit = emit;
		}

		const spread = spreadProps.bind(this, perso);
		function update(update: Partial<Action>) {
			if (update) {
				if (child && update.content) child.update(update.content as any);
				spread(update);
			}
		}

		update(initial_);
		return perso;
	}
}

function spreadProps(perso: PersoItem, props: Partial<Action>) {
	if (!props) return;
	const { style: style_, move, ...attributes } = props;
	const { node } = perso;

	const style = resolveStyles(style_, this.zoom, perso);
	for (const key in style) node.style[key] = style[key];

	for (const name in attributes) {
		if (['content', 'tag', 'id', 'track'].includes(name)) continue;
		const value = attributes[name];
		if (name in node) node[name] = value;
		else node.setAttribute(name, value);
	}

	if (move) {
		const parentId = typeof move === 'string' ? move : move.to;
		perso.parent = parentId || perso.parent;
		const layer = this.getPerso(parentId)?.child;

		if (layer instanceof Layer) {
			const order = typeof move === 'object' ? move.order : undefined;
			layer.add(perso.node, order);
			layer.update(layer.content);
		}
	}
}

function reset() {
	this.transform = {};
	this.style = {};
	this.prec = {};
	this.parent = undefined;
	removeAttributes(this.node);
	this.update(this.initial);
}

function removeAttributes(node: HTMLElement) {
	for (let i = node.attributes.length - 1; i >= 0; i--) {
		const name = node.attributes[i].name;
		name !== 'id' && node.removeAttribute(name);
	}
}

// private addListeners(id: string, perso: any, emit: any) {
// 	perso.listeners = new Map();
// 	for (const prop in emit) {
// 		const event = emit[prop];
// 		event.data.id = id;
// 		const handler = this.handler(event);
// 		perso.listeners.set(prop, handler);
// 		perso.node.addEventListener(prop, handler);
// 	}
// }

// private removeListeners(id: string) {
// 	const perso = this.persos.get(id);
// 	if (perso) {
// 		perso.listeners.forEach((handler, prop) => {
// 			perso.node.removeEventListener(prop, handler);
// 		});
// 	}
// }
