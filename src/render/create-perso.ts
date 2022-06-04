import { resolveStyles } from './resolve-styles';

import { Action, Eventime, PersoElementType, PersoItem, PersoNode } from '../types';

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
		requestAnimationFrame(() =>
			this.persos.forEach((perso: PersoItem) => {
				const style = resolveStyles(perso.style, zoom);
				perso.update();
			})
		);
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

	handleEvent = (event) => {
		console.log(event.type);
		console.log(event);
		console.log(event.target.dataset.id);

		console.log(this);

		const persoId = event.target.dataset.id;
		const perso = this.persos.get(persoId);
		const emit = perso.emit[event.type];

		emit.data = { ...emit.data, emit: { e: event, type: event.type, id: event.target.dataset.id } };
		console.log(emit);

		emit && this.handler(emit);
	};

	private createPerso(id: string, { type, initial, actions, emit }: PersoNode) {
		const { tag, content, ..._initial } = initial;
		const node = document.createElement(tag || 'div');
		node.id = id;
		this.spread(node, _initial);
		const style = initial.style || {};

		const child = createContent(type, node);
		if (child) {
			if (type !== PersoElementType.LAYER) {
				node.appendChild(child.node);
				child.update(content as any);
			}
		} else {
			console.warn(`le type ${type} n'est pas supporté`);
		}

		if (emit) {
			node.dataset.id = id;
			for (const ev in emit) {
				node.addEventListener(ev, this);
			}
		}
		const spread = this.spread.bind(this, node);

		const perso: PersoItem = {
			id,
			prec: {},
			node,
			style,
			initial,
			actions,
			update({ content, ...update }: Partial<Action> = { style: perso.style }) {
				child.update(content as any);
				spread(update);
			},
			child,
			//add/remove/Listener ?
		};
		emit && (perso.emit = emit);

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
			const value = attributes[name];
			if (name in node) node[name] = value;
			else node.setAttribute(name, value);
		}
	}
}

export function createContent(type: PersoElementType, parentNode: HTMLElement) {
	switch (type) {
		case PersoElementType.TEXT:
			return new Txt();
		case PersoElementType.LAYER:
			return new Layer(parentNode);
		default:
			return null;
	}
}

export class Txt {
	node = document.createTextNode('');
	update(text: string | number) {
		this.node.textContent = String(text);
	}
}

export class Layer {
	node: HTMLElement;
	content: null | HTMLElement[] = null;
	constructor(node: HTMLElement) {
		this.node = node;
	}

	add(item: HTMLElement, order: number = null) {
		if (!this.content) return (this.content = [item]);
		if (!order) {
			this.content.push(item);
		} else {
			this.content.splice(order, 0, item);
		}
		return this.content;
	}
	remove(item: HTMLElement) {
		if (!this.content) return;
		const index = this.content.indexOf(item);
		if (index > -1) {
			this.content.splice(index, 1);
		}
	}
	order(list) {}

	update(content: any) {
		if (!content) return;
		if (Array.isArray(content)) {
			const child = document.createDocumentFragment();
			content.forEach((content) => {
				child.appendChild(content);
				this.node.appendChild(child);
			});
		} else {
			this.node.appendChild(content);
		}
	}
}
// export function _createContent(content) {
// 	if (!content) return null;
// 	if (typeof content === 'string' || typeof content === 'number') {
// 		return document.createTextNode(String(content));
// 	}
// 	if (typeof content === 'object' && content.node) {
// 		return content.node;
// 	}

// 	if (Array.isArray(content)) {
// 		const parts = content.map(_createContent);
// 		const fragment = document.createDocumentFragment();
// 		parts.forEach((part) => fragment.appendChild(part));
// 		return fragment;
// 	}

// 	if (content instanceof HTMLElement) return content;
// 	if (typeof content === 'function') return content();

// 	return '';
// }

// PERSOS////////////
const root = document.getElementById('app');
const stage = {
	width: 1000,
	height: 750,
	ratio: 4 / 3,
};

function calculateZoom() {
	const el = root;

	// determiner l'échelle du projet, comparée à sa valeur par défaut.
	const width = el.clientWidth;
	const height = el.clientHeight;
	const wZoom = width / stage.width;
	const hScene = wZoom * stage.height;

	if (hScene > height) {
		const zoom = height / stage.height;
		const wScene = stage.width * zoom;
		return round({
			left: (width - wScene) / 2,
			top: 0,
			width: wScene,
			height,
			ratio: wScene / height,
			zoom,
		});
	} else {
		return round({
			left: 0,
			top: (height - hScene) / 2,
			width,
			height: hScene,
			ratio: hScene / width,
			zoom: wZoom,
		});
	}
}

type GenericObject = Record<string, any>;
export function round(obj: GenericObject): GenericObject {
	const r = {};
	for (const e in obj) {
		r[e] = typeof obj[e] === 'number' ? parseFloat(obj[e].toFixed(2)) : obj[e];
	}
	return r;
}
