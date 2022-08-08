import type { Action, Render, Update } from './types';

type QueueActionProp = Pick<Action, 'style' | 'className' | 'content' | 'attr'>;
type Attribute = {
	[attribute in QueueActionProp as string]: Partial<Action>[];
};

export class QueueActions {
	stack = new Map<string, Partial<Attribute>>();
	state = new Map<string, Partial<Attribute>>();
	callback: Render;

	constructor(render: Render) {
		this.callback = render;
	}

	add(id: string, action: Action) {
		const attributes = this.stack.has(id) ? this.stack.get(id) : {};
		for (const attr in action) {
			attr in attributes ? attributes[attr].push(action[attr]) : (attributes[attr] = [action[attr]]);
		}
		this.stack.set(id, attributes);
	}

	// update ne renvoie que les les émissions

	render = () => {
		const update: Update = {};
		this.stack.forEach((actions, id) => {
			const state = this.state.get(id) || {};
			// const reduces = state;
			const reduces = {};
			// id === 'third' && console.log(actions);
			for (const action in actions) {
				reduces[action] = actions[action].reduce((prec: any, current) => {
					// id === 'third' && console.log(action, prec, current);
					switch (action) {
						case 'className':
							return ((prec || '') + ' ' + (current || '')).trim();
						case 'style':
							return { ...prec, ...current };

						case 'content':
							return current;

						default:
							return current;
					}
				}, state[action]);
			}
			update[id] = reduces;
			this.state.set(id, reduces);
			// id === 'third' && console.log(update[id]);
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
