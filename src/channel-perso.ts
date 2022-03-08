import { CbStatus } from './clock';
import { ChannelName, Transition } from './types';
import { Channel, ChannelProps } from './channel';

export type ProgressInterpolation = (time: number) => FromTo;

export class PersoChannel extends Channel {
	name: ChannelName = ChannelName.MAIN;

	run({ name, time, status }: ChannelProps): void {
		if (status.action === 'seek') this.queue.resetState();

		for (const perso in this.store) {
			const action = this.store[perso].actions[name];

			if (action) {
				const { move, transition, ..._action } = action;
				transition && this.transition({ perso, time, status, transition });
				this.queue.add(perso, _action);
				// console.log(perso.toUpperCase(), name, _action);
			}
		}
	}

	transition = (props: { perso: string; time: number; transition: Transition; status: CbStatus }) => {
		const { perso, time, transition, status } = props;

		const state = this.queue.stack.get(perso) || this.store[perso].initial;
		const from = (transition.from || state.style) as FromTo;
		const to = transition.to as FromTo;
		const duration = transition.duration;
		const start = time;
		const end = start + duration;
		const progress: ProgressInterpolation = interpolate({ from, to, start, end });

		// console.log('transition', from, to, start, end, status.currentTime);
		if (status.action !== 'seek') {
			const transtitionComplete = this.timer.subscribeTick((status) => {
				if (status.currentTime >= end) transtitionComplete();
				this.renderTransition(perso, progress(status.currentTime));
			});
		}

		this.renderTransition(perso, progress(status.currentTime));

		//init
		// preparer from et to
		// lerp
		// push
		// boucle avec start et end
	};
	renderTransition = (perso: string, result: FromTo) => {
		const style = {};
		for (const prop in result) style[prop] = Math.round(result[prop]) + 'px';
		this.queue.add(perso, { style });
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

export type FromTo = { [x: string]: number };
interface InterpolateProps {
	from: FromTo;
	to: FromTo;
	start: number;
	end: number;
}

export const interpolate =
	({ from, to, start, end }: InterpolateProps) =>
	(time: number): FromTo => {
		if (time >= end) return to;
		const progress = (time - start) / (end - start);

		const result = {};
		for (const p in from) result[p] = lerp(from[p], to[p], progress);
		return result;
	};

function lerp(start: number, end: number, amt: number) {
	return (1 - amt) * start + amt * end;
}
