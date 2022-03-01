import { Action } from './types';

type QueueActionProp = Pick<Action, 'style' | 'className' | 'content' | 'attr'>;
type Attribute = {
	[attribute in QueueActionProp as string]: Partial<Action>[];
};
type Render = (update) => void;

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

	render = () => {
		const update = {};
		this.stack.forEach((actions, id) => {
			const state = this.state.get(id) || {};
			const reduces = {};
			for (const action in actions) {
				reduces[action] = actions[action].reduce((prec: any, curr) => {
					if (typeof curr === 'string') return prec + ' ' + curr;
					return { ...prec, ...curr };
				}, state[action]);
			}
			update[id] = reduces;
			this.state.set(id, reduces);
		});

		return update;
	};

	flush = () => {
		this.callback(this.render());
		this.stack = new Map<string, Partial<Attribute>>();
	};
}
