import { calculateZoom } from './zoom';
import { createContent } from './components';
import { resolveStyles } from './resolve-styles';

import type { AddEvent } from '../tracks';
import type { Action, PersoElementType, PersoItem, PersoNode } from '../types';

export interface HandlerEmit {
	e: Event;
	type: Event['type'];
	id: string;
}

export type StorePersoItems = Map<string, PersoItem>;

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
		requestAnimationFrame(() => this.persos.forEach((perso: PersoItem) => perso.update({ style: perso.style })));
	};

	addAll(persos: Map<string, PersoNode>) {
		persos.forEach((perso, id) => {
			this.add(id, perso);
		});
	}

	add(id: string, perso_: PersoNode) {
		console.log('ADD-->', perso_.type, id);

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
		const { tag, content, ...initial_ } = initial;
		const node = document.createElement(tag || 'div');
		node.id = id;
		const child = createContent(type, { parentNode: node });
		if (child) child.update(content as any);

		const perso: PersoItem = {
			id,
			node,
			child,
			initial,
			actions,
			prec: {},
			transform: {},
			style: initial.style || {},
			reset,
			update,
			//add/remove/Listener ?
		};

		const spread = this.spread.bind(this, perso);
		spread(initial_);

		function update(update: Partial<Action>) {
			if (update) {
				if (child && update.content) child.update(update.content as any);
				spread(update);
			}
		}

		if (emit) {
			node.dataset.id = id;
			for (const ev in emit) {
				node.addEventListener(ev, this);
			}
			perso.emit = emit;
		}

		return perso;
	}

	private spread(perso: PersoItem, props: Partial<Action>) {
		if (!props) return;
		const { style, ...attributes } = props;
		const { node } = perso;

		const style_ = resolveStyles(style, this.zoom, perso);
		// style_.transform && console.log('TRANSFORM', style_.transform);
		for (const key in style_) node.style[key] = style_[key];

		for (const name in attributes) {
			if (['content', 'tag', 'id', 'track'].includes(name)) continue;
			const value = attributes[name];
			if (name in node) node[name] = value;
			else node.setAttribute(name, value);
		}
	}
}

function reset() {
	this.transform = {};
	this.style = {};
	this.prec = {};
	removeAttributes(this.node);
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
