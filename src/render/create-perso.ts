import { Action, Content, Eventime, PersoNode } from 'src/types';
import { sortUserPlugins } from 'vite';
import { objectToString } from '../common/utils';

type HandlerEventime = (event: Eventime, target: Event) => void;
type HandlerEvent = (event: Eventime) => (target: Event) => void;

export class PersoStore {
	persos = new Map<string, any>();
	handler: HandlerEvent = null;
	constructor(handler: HandlerEventime) {
		this.handler = (event: Eventime) => (e: Event) => {
			console.log(event);
			console.log(e);
			// c'est un event immédiat qu'il faut créer, disponible que dans un channel, et pas timeline...
			// de plus, il faut le dispatcher en fonction du chanel désigné
			handler(event, e);
		};
	}
	add(id: string, { initial, emit, actions }: PersoNode) {
		const perso = this.createPerso(id, initial);
		emit && this.addListeners(id, perso, emit);
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

	private addListeners(id: string, perso: any, emit: any) {
		perso.listeners = new Map();
		for (const prop in emit) {
			const event = emit[prop];
			event.data.id = id;
			const handler = this.handler(event);
			perso.listeners.set(prop, handler);
			perso.node.addEventListener(prop, handler);
		}
	}

	removeListeners(id: string) {
		const perso = this.persos.get(id);
		if (perso) {
			perso.listeners.forEach((handler, prop) => {
				perso.node.removeEventListener(prop, handler);
			});
		}
	}

	private createPerso(id: string, { tag = 'div', ...initial }) {
		const node = document.createElement(tag);
		node.id = id;
		this.spread(node, initial);
		let content = createContent(initial.content || initial.children);
		node.appendChild(content);

		const perso = {
			update: (update: Partial<Action>) => this.spread(node, update),
			node,
			get content() {
				return content;
			},
			set content(newContent) {
				content = createContent(newContent);
				node.firstChild ? node.replaceChild(content, node.firstChild) : node.appendChild(content);
			},
		};
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
function createContent(content) {
	if (!content) return null;
	if (typeof content === 'string' || typeof content === 'number') {
		return document.createTextNode(String(content));
	}

	if (Array.isArray(content)) {
		return content.map(createContent);
	}
	return content;
}
