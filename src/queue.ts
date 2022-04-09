import { Action } from './types';

type QueueActionProp = Pick<Action, 'style' | 'className' | 'content' | 'attr'>;
export type Attribute = {
	[attribute in QueueActionProp as string]: Partial<Action>[];
};
export type Render = (update: Partial<Action>) => void;

export class QueueActions {
	stack = new Map<string, Partial<Attribute>>();
	state = new Map<string, Partial<Attribute>>();
	callback: Render;

	constructor(callback: Render) {
		this.callback = callback;
	}

	add(id: string, action: Action) {
		const attributes = this.stack.has(id) ? this.stack.get(id) : {};
		for (const attr in action) {
			attr in attributes ? attributes[attr].push(action[attr]) : (attributes[attr] = [action[attr]]);
		}
		this.stack.set(id, attributes);
	}

	// TODO etoffer le rendu pour tenir compte
	// des particularités de chaque propriété
	// un reducer par propriété

	render = (): { [id: string]: Partial<Attribute> } => {
		const update = {};
		this.stack.forEach((actions, id) => {
			const state = this.state.get(id) || {};
			const reduces = state;
			for (const action in actions) {
				reduces[action] = actions[action].reduce((prec: any, current) => {
					switch (action) {
						case 'className':
							return ((prec || '') + ' ' + (current || '')).trim();
						case 'style':
							return { ...prec, ...current };
						case 'content':
							return current;

						default:
							break;
					}
				}, state[action]);
			}
			update[id] = reduces;
			this.state.set(id, reduces);
		});

		return update;
	};

	flush = () => {
		if (this.stack.size) {
			this.callback(this.render());
			this.stack = new Map<string, Partial<Attribute>>();
		}
	};

	resetState = () => (this.state = new Map<string, Partial<Attribute>>());
}
