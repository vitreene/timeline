import { Status, CbStatus, Timer } from './clock';
import { QueueActions } from './queue';
import { ChannelName, Store, Style, Transition } from './types';

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
	timer: Timer;
	queue: QueueActions;

	constructor(name: ChannelName, options) {
		super(name);
		this.queue = options.queue;
		this.timer = options.timer;
		this.timer.subscribeTick(this.queue.flush);
	}
	addStore(store: Store) {
		this.store = store;
	}
	addQueue(queue: QueueActions) {
		this.queue = queue;
	}

	run(name: string, status: CbStatus) {
		for (const perso in this.store) {
			const action = this.store[perso].actions[name];

			if (action) {
				const { move, transition, ..._action } = action;
				transition && this.transition({ perso, status, transition });
				this.queue.add(perso, _action);
				console.log(perso.toUpperCase(), name, _action);
			}
		}
	}

	transition = (props: { perso: string; transition: Transition; status: CbStatus }) => {
		const { perso, transition, status } = props;
		const state = this.queue.stack.get(perso) || this.store[perso].initial;
		const from = (transition.from || state.style) as FromTo;
		const to = transition.to as FromTo;
		const duration = transition.duration;
		const start = status.currentTime;
		const end = start + duration;
		const t = interpolate({ from, to, start, end });
		console.log('transition', t);

		//init
		// preparer from et to
		// lerp
		// push
		// boucle avec start et end
	};
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

type FromTo = { [x: string]: number };
interface InterpolateProps {
	from: FromTo;
	to: FromTo;
	start: number;
	end: number;
}

export const interpolate =
	({ from, to, start, end }: InterpolateProps) =>
	(time: number) => {
		const progress = (time - start) / end;
		const result = {};
		for (const p in from) result[p] = lerp(from[p], to[p], progress);
		return result;
	};

function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
}
