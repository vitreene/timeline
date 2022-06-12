import { calculateZoom } from './zoom';
import { createContent } from './components';
import { resolveStyles } from './resolve-styles';

import type { Action, Eventime, PersoItem, PersoNode } from '../types';

export interface HandlerEmit {
	e: Event;
	type: Event['type'];
	id: string;
}

type HandlerEvent = (event: Eventime) => void;

export type StorePerso = Map<string, PersoItem>;

export class PersoStore {
	persos: StorePerso = new Map();
	zoom = 1;
	removeResize: () => void;
	handler: HandlerEvent = null;

	constructor(handler: HandlerEvent) {
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
		requestAnimationFrame(() => this.persos.forEach((perso: PersoItem) => perso.update()));
	};

	addAll(persos: Map<string, PersoNode>) {
		persos.forEach((perso, id) => {
			this.add(id, perso);
		});
	}

	add(id: string, _perso: PersoNode) {
		const perso = this.createPerso(id, _perso);
		this.persos.set(id, perso);
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
		const { tag, content, ..._initial } = initial;
		const node = document.createElement(tag || 'div');
		node.id = id;
		const spread = this.spread.bind(this, node);
		spread(_initial);

		const child = createContent(type, node);
		if (child) child.update(content as any);

		function update(update: Partial<Action>) {
			if (update) {
				if (child) child.update(update.content as any);
				spread(update);
			}
		}
		function reset() {
			removeAttributes(node);
		}

		const perso: PersoItem = {
			id,
			node,
			child,
			initial,
			actions,
			prec: {},
			style: initial.style || {},
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

		return perso;
	}

	private spread(node: HTMLElement, props: Partial<Action>) {
		if (!props) return;
		const { style, ...attributes } = props;
		switch (typeof style) {
			case 'object':
				const _style = resolveStyles(style, this.zoom);
				for (const key in _style) node.style[key] = _style[key];
				break;
			case 'string':
				node.style.cssText = style;
				break;
			case 'undefined':
			default:
				break;
		}

		for (const name in attributes) {
			if (['content', 'tag'].includes(name)) continue;
			const value = attributes[name];
			if (name in node) node[name] = value;
			else node.setAttribute(name, value);
		}
	}
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
