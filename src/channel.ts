import { Status, CbStatus, Timer } from './clock';
import { QueueActions } from './queue';
import { ChannelName, Store, Transition } from './types';

interface ChannelProps {
	name: string;
	time: number;
	status: CbStatus;
}
export class Channel {
	name: ChannelName;
	constructor(name: ChannelName) {
		this.name = name;
	}
	run({ name, time, status }: ChannelProps): void {
		console.log('Channel', this.name.toUpperCase(), name, time, status);
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

	run({ name, time, status }: ChannelProps): void {
		for (const perso in this.store) {
			const action = this.store[perso].actions[name];

			if (action) {
				const { move, transition, ..._action } = action;
				transition && this.transition({ perso, time, status, transition });
				this.queue.add(perso, _action);
				console.log(perso.toUpperCase(), name, _action);
			}
		}
	}

	transition = (props: { perso: string; time: number; transition: Transition; status: CbStatus }) => {
		const { perso, time, transition, status } = props;

		const state = this.queue.stack.get(perso) || this.store[perso].initial;
		const from = (transition.from || state.style) as FromTo;
		const to = transition.to as FromTo;
		const duration = transition.duration;
		const start = time; /*  status.currentTime */
		const end = start + duration;

		if (status.currentTime >= end) return to;

		const t = interpolate({ from, to, start, end });

		console.log('transition', from, to, start, end, status.currentTime);

		const render = (currentTime: number) => {
			const result: any = t(currentTime);
			const style = {};
			for (const prop in result) style[prop] = Math.round(result[prop]) + 'px';
			this.queue.add(perso, { style });
		};

		console.log(status);

		if (status.action !== 'seek') {
			const transtitionComplete = this.timer.subscribeTick((status) => {
				console.log(status.currentTime);
				if (status.currentTime >= end) transtitionComplete();
				render(status.currentTime);
			});
		}
		render(status.currentTime);

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
	(time: number): { [x: string]: number } => {
		const progress = (time - start) / (end - start);

		const result = {};
		for (const p in from) result[p] = lerp(from[p], to[p], progress);
		return result;
	};

function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
}
