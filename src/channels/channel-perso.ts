import { Channel } from './channel';
import { Transition } from './transition';
import { Layer } from '../render/components/layer';

import { ChannelName } from '../types';
import { FORWARD, INITIAL, PLAY, SEEK, TIME_INTERVAL } from '../common/constants';

import type { FromTo } from './transition';
import type { RunEvent, ChannelOptions } from './channel';
import type { CbStatus } from '../clock';
import type { StrapProps } from '../straps/strap';
import type { Eventime, Move, PersoItem } from '../types';

export type ProgressInterpolation = (time: number, start: number, end: number) => FromTo;

export class PersoChannel extends Channel {
	name = ChannelName.MAIN;
	transition: Transition;

	constructor(options: ChannelOptions) {
		super(options);
		const props: StrapProps = {
			store: this.store,
			queue: options.queue,
			addEvent: this.addEvent,
			next: this.next_('transition'),
		};
		this.transition = new Transition(props);
	}

	reset(): void {
		this.store.persos.forEach((perso) => perso.reset());
	}

	run({ name, time, status, data }: RunEvent): void {
		// if (status.statement === SEEK) {
		// 	//TODO passer status
		// 	this.queue.resetState();
		// }

		const { track, ...data_ } = data || {};
		this.store.persos.forEach((perso, id) => {
			const action = perso.actions[name];
			if (action) {
				if (name === INITIAL) perso.reset();
				if (typeof action === 'boolean') {
					this.queue.add(id, data_, status);
				} else {
					const { move, transition, ..._action } = action;
					if (transition) {
						// mieux : si store est modifié, propager la modif.
						this.transition.addStore(this.store);

						this.transition.run(status, { id, time, transition });
					}
					move && this.move(move, perso, status);

					this.queue.add(id, { ..._action, ...data_ }, status);
				}
			}
		});
	}

	runNext({ name, status, data }: RunEvent): void {
		if (name === 'transition') {
			this.transition.run(status, data);
		}
	}

	next_ = (strapName: string) => (event_: Omit<Eventime, 'startAt'>, status: CbStatus) => {
		const event = { startAt: status.currentTime + TIME_INTERVAL, ...event_ };
		if (status.statement === PLAY) {
			this.next(strapName, event); // @ this.tracks.setNext
		}
	};

	move = (move: string | Move, perso: PersoItem, status: CbStatus) => {
		if (typeof move === 'string') {
			const id = move;
			const parent = this.store.getPerso(id).child;
			if (parent instanceof Layer) {
				parent.add(perso.node);
				const content = parent.content;
				this.queue.add(id, { content }, status);
			}
		}
	};
}
