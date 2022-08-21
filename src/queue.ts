import { CbStatus } from './clock';
import { SEEK, SEEKING } from './common/constants';
import type { Action, Render, Update } from './types';

type QueueActionProp = Pick<Action, 'style' | 'className' | 'content' | 'attr'>;
type Attribute = {
	[attribute in QueueActionProp as string]: Partial<Action>[];
};

type PersoState = Map<string, Partial<Action>>;
interface StackProps {
	status: CbStatus;
	action: Partial<Action>;
}
export class QueueActions {
	stack = new Map<string, StackProps[]>();
	last = new Map<string, PersoState>();
	callback: Render;

	constructor(render: Render) {
		this.callback = render;
	}

	add(id: string, action: Action, status: CbStatus) {
		const stack = this.stack.has(id) ? this.stack.get(id) : [];
		stack.push({ action, status });
		this.stack.set(id, stack);
	}

	render = () => {
		const update: Update = {};
		this.stack.forEach((stack, id) => {
			let reduces: Partial<Action> = {};
			stack.forEach(({ action, status }) => {
				reduces = mergeAction(action, reduces);
				this.addToLast(id, action, status);
			});

			// si seeking, ajouter les props des pistes en lecture
			let reduceSeek: Partial<Action> = {};
			stack.forEach(({ status }) => {
				if (status.statement === SEEKING) {
					this.last.forEach((last, track) => {
						if (track === status.trackName) return;
						const action = last.get(id);
						reduceSeek = mergeAction(action, reduceSeek);
					});
				}
			});
			update[id] = mergeAction(reduceSeek, reduces);
		});

		return update;
	};

	flush = () => {
		if (this.stack.size) {
			this.callback(this.render());
			this.stack = new Map<string, StackProps[]>();
		}
	};

	// resetState = () => null;
	// resetState = () => (this.state = new Map<string, Partial<Attribute>>());

	private addToLast(id: string, action: Partial<Action>, { trackName, statement }: CbStatus) {
		!this.last.has(trackName) && this.last.set(trackName, new Map<string, Partial<Action>>());
		const last = this.last.get(trackName);
		const lastState = mergeAction(action, last.get(id));
		last.set(id, lastState);
	}
}

function mergeAction(action: Partial<Action> = {}, reduce: Partial<Action> = {}) {
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
