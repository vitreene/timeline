import { Channel } from './channel';
import { Transition } from './transition';
import { Layer } from '../render/components/layer';

import { ChannelName } from '../types';
import { FORWARD, PLAY, SEEK } from '../common/constants';

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
		if (status.seekAction === FORWARD) return;
		if (status.statement === SEEK) {
			status.currentTime = status.seekTime;
			this.queue.resetState();
		}

		this.store.persos.forEach((perso, id) => {
			const action = perso.actions[name];

			if (action) {
				if (typeof action === 'boolean') {
					this.queue.add(id, data);
				} else {
					const { move, transition, ..._action } = action;
					if (transition) {
						// mieux : si store est modifié, propager la modif.
						this.transition.addStore(this.store);
						this.transition.run(status, { id, time, transition });
					}
					move && this.move(move, perso);

					this.queue.add(id, { ..._action, ...data });
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
		const event = { startAt: status.nextTime, ...event_ };
		// status.seekAction && console.log('next_------>', status.statement, status.seekAction, event.name, event, status);

		if (status.statement === PLAY) {
			// this.tracks.setNext
			this.next(strapName, event);
		}
		if (status.seekAction === FORWARD) {
			this.executeEvent(event.name, event, status);
		}
	};

	move = (move: string | Move, perso: PersoItem) => {
		if (typeof move === 'string') {
			const id = move;
			const parent = this.store.getPerso(id).child;
			if (parent instanceof Layer) {
				parent.add(perso.node);
				const content = parent.content;
				this.queue.add(id, { content });
			}
		}
	};
}
