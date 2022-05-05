import { Action, Content, Eventime, HandlerListener, PersoItem, PersoNode } from 'src/types';
import { objectToString } from '../common/utils';

type HandlerEvent = (event: Eventime) => void;

// type HandlerEventime = (event: Eventime, target: Event) => void;
export type StorePerso = Map<string, PersoItem>;

export class PersoStore {
	persos: StorePerso = new Map();
	handler: HandlerEvent = null;

	constructor(handler: HandlerEvent) {
		this.handler = handler;
		/* 
		(event: Eventime) => (e: Event) => {
			console.log(event);
			console.log(e);
			// c'est un event immédiat qu'il faut créer, disponible que dans un channel, et pas timeline...
			// de plus, il faut le dispatcher en fonction du chanel désigné
			handler(event, e);
		}; */
	}

	addAll(persos: Map<string, PersoNode>) {
		persos.forEach((perso, id) => {
			this.add(id, perso);
		});
	}

	add(id: string, _perso: PersoNode) {
		const perso = this.createPerso(id, _perso);
		// emit && this.addListeners(id, perso, emit);
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
		emit && this.handler(emit);
	};

	private createPerso(id: string, { initial, actions, emit }: PersoNode) {
		// console.log(this);
		const node = document.createElement(initial.tag || 'div');
		node.id = id;
		this.spread(node, initial);
		// let content = createContent(initial.content || initial.children);
		const content = createContent(initial.content);
		content && node.appendChild(content);
		if (emit) {
			node.dataset.id = id;
			for (const ev in emit) {
				node.addEventListener(ev, this);
			}
		}
		const perso: PersoItem = {
			node,
			initial,
			actions,
			update: (update: Partial<Action>) => this.spread(node, update),
			content,
			//add/remove/Listener ?
		};
		emit && (perso.emit = emit);

		return perso;
	}

	private spread(el: HTMLElement, props: Partial<Action>) {
		if (!props) return;
		for (const name in props) {
			switch (true) {
				case name === 'style':
					const style = objectToString(props[name]);
					el.setAttribute(name, style);
					break;

				default:
					el.setAttribute(name, props[name]);
					break;
			}
		}
	}
}

// content peut etre un node, interprété à partir d'une string, dans une procédure de prépartion des contenus.
export function createContent(content) {
	if (!content) return null;
	if (typeof content === 'string' || typeof content === 'number') {
		return document.createTextNode(String(content));
	}
	if (typeof content === 'object' && content.node) {
		return content.node;
	}

	if (Array.isArray(content)) {
		const parts = content.map(createContent);
		const fragment = document.createDocumentFragment();
		parts.forEach((part) => fragment.appendChild(part));
		return fragment;
	}

	if (content instanceof HTMLElement) return content;
	if (typeof content === 'function') return content();

	return '';
}
