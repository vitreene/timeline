import { Status, CbStatus } from './clock';
import { Action, ChannelName, Store } from './types';

export class Channel {
	name: ChannelName;
	constructor(name: ChannelName) {
		this.name = name;
	}
	run(name: string, event: Status) {
		console.log('Channel', this.name.toUpperCase(), name, event.currentTime);
	}
}

export class PersoChannel extends Channel {
	store: Store;
	queue: QueueActions;
	constructor(props) {
		super(props);
	}
	addStore(store: Store) {
		this.store = store;
	}
	addQueue(queue: QueueActions) {
		this.queue = queue;
	}
	run(name: string, status: CbStatus) {
		for (const perso in this.store) {
			const action = this.store[perso][name];
			if (action) {
				this.queue && this.queue.add(perso, action);
				console.log(perso.toUpperCase(), name, action);
			}
		}
	}
}
/* 
Todo 
dispatch les propriétés trouvées :
- celles qui necessitent un traitement : move, transition, classNames
- les autres directement

- envoyées dans une queue 
- répartition par propriété
- reduce

`puis :
-> scale des styles 
-> update
une queue par perso, ou bien globale ?

*/

type QueueActionProp = Pick<Action, 'style' | 'className' | 'content' | 'attr'>;
type Attribute = {
	[attribute in QueueActionProp as string]: Partial<Action>[];
};
type Render = (update) => void;

export class QueueActions {
	queue = new Map<string, Partial<Attribute>>();
	state = new Map<string, Partial<Attribute>>();
	callback: Render;
	constructor(callback: Render) {
		this.callback = callback;
	}
	add(id: string, action: Action) {
		const attributes = this.queue.has(id) ? this.queue.get(id) : {};
		for (const attr in action) {
			attr in attributes ? attributes[attr].push(action[attr]) : (attributes[attr] = [action[attr]]);
		}
		this.queue.set(id, attributes);
	}

	// TODO etoffer le rendu pour tenir compte
	// des particularités de chaque propriété
	// un reducer par propriété

	render = () => {
		const update = {};
		this.queue.forEach((actions, id) => {
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
		this.queue = new Map<string, Partial<Attribute>>();
	};
}
