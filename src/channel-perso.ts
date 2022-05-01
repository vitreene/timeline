import { CbStatus } from './clock';
import { ChannelName, Transition, Move, Content, PersoItem } from './types';
import { Channel, ChannelProps } from './channel';
import { FORWARD, PLAY, SEEK } from './common/constants';

export type ProgressInterpolation = (time: number) => FromTo;

export class PersoChannel extends Channel {
	name: ChannelName = ChannelName.MAIN;

	run({ name, time, status, data }: ChannelProps): void {
		// console.log('RUN PERSO', { time, name, data });

		if (status.seekAction === FORWARD) return;
		if (status.action === SEEK) {
			status.currentTime = status.seekTime;
			this.queue.resetState();
		}

		this.store.persos.forEach((perso, id) => {
			const action = perso.actions[name];

			if (action) {
				if (typeof action === 'boolean') this.queue.add(id, data);
				else {
					const { move, transition, ..._action } = action;
					transition && this.transition({ id, time, status, transition });
					move && this.move(move, perso);
					this.queue.add(id, { ..._action, ...data });
				}
			}
		});
	}

	transitionCache = new Set();
	transition = (props: { id: string; time: number; transition: Transition; status: CbStatus }) => {
		// console.log('transition', props);

		const { id, time, transition, status } = props;

		const state = this.queue.stack.get(id) || this.store.getPerso(id).initial;
		const from = (transition.from || state.style) as FromTo;
		const to = transition.to as FromTo;
		const duration = transition.duration;
		const start = time;
		const end = start + duration;
		const progress: ProgressInterpolation = interpolate({ from, to, start, end });

		if (status.action !== SEEK && !this.transitionCache.has(props)) {
			this.transitionCache.add(props);
			this.timer.subscribeTick((status) => {
				if (status.action === PLAY && status.currentTime < end && status.currentTime >= start) {
					this.renderTransition(id, progress(status.currentTime));
				}
			});
		}

		this.renderTransition(id, progress(status.currentTime));

		//init
		// preparer from et to
		// lerp
		// push
		// boucle avec start et end
	};
	renderTransition = (id: string, result: FromTo) => {
		const style = {};
		for (const prop in result) {
			style[prop] = Math.round(result[prop] * 10) / 10;
		}
		this.queue.add(id, { style });
	};

	move = (move: string | Move, perso: PersoItem) => {
		if (typeof move === 'string') {
			const id = move;
			const parentContent = this.store.getPerso(id).content;
			let content: Content | Content[];
			if (parentContent) {
				content = Array.isArray(parentContent) ? [...parentContent, perso] : [parentContent, perso];
			} else {
				content = perso;
			}

			this.store.getPerso(id).content = content;
			this.queue.add(id, { content });
		}
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
