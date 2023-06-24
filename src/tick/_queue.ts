import { Action } from './types';

type Update = Record<string, Partial<Action>>;
type Render = (update: Update) => void;

class Queue {
	stack: Map<string, Action[]> = new Map();
	renderer: Render;

	constructor(renderer) {
		this.renderer = renderer;
	}
	add(id: string, action: Action) {
		const stack = this.stack.has(id) ? this.stack.get(id) : [];
		stack.push(action);
		this.stack.set(id, stack);
	}

	render = () => {
		const update = {};
		this.stack.forEach((stack, id) => {
			let reduces = {} as Action;
			stack.forEach((action: Action) => {
				reduces = mergeAction(action, reduces);
			});
			update[id] = reduces;
		});
		return update;
	};

	flush = () => {
		if (this.stack.size) {
			const updates = this.render();
			this.renderer(updates);
			this.stack.clear();
		}
	};
}

function mergeAction(action = {} as Action, reduce = {} as Action) {
	const merge = reduce;
	for (const key in action) {
		switch (key) {
			case 'className':
				merge.className = ((merge.className || '') + ' ' + (action.className || '')).trim();
				break;
			case 'style':
				merge.style = { ...merge.style, ...action.style };
				break;
			case 'content':

			default:
				merge[key] = action[key];
		}
	}
	return merge;
}
