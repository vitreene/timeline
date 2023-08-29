import { Channel } from './channel';
import { Transition } from './transition';

import { ChannelName, PersosTypes } from '../../types';
import { INITIAL, PLAY, SEEK, TIME_INTERVAL } from '../../common/constants';

import type { FromTo } from './transition';
import type { RunEvent, ChannelOptions } from './channel';
import type { CbStatus } from '../clock';
import type { StrapProps } from '../straps/strap';
import type { Eventime } from '../../types';
import { StorePersos } from 'src/legacy/render/create-perso';

const persoTypes: string[] = Object.values(PersosTypes);
export type ProgressInterpolation = (time: number, start: number, end: number) => FromTo;

export class PersoChannel extends Channel {
	hasReset = new Set<string>();
	store: StorePersos;
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

	setStore(store: StorePersos) {
		this.store = store;
	}
	reset(): void {
		this.store.persos.forEach((perso) => perso.reset());
	}

	run({ name, time, status, data }: RunEvent): void {
		status.statement === PLAY && this.hasReset.size && this.hasReset.clear();

		const { track, ...data_ } = data || {};
		this.store.persos.forEach((perso, id) => {
			const action = perso.actions[name];
			if (action) {
				// reinitialiser l'élément si SEEK et 1ere action
				if (status.statement === SEEK && !this.hasReset.has(perso.id)) {
					perso.reset();
					this.hasReset.store(perso.id);
				}

				if (typeof action === 'boolean') {
					this.queue.add(id, data_, status);
				} else {
					const { transition, ...action_ } = action;
					if (transition) {
						// TODO : si store est modifié, propager la modif.
						this.transition.setStore(this.store);
						this.transition.run(status, { id, time, transition });
					}
					this.queue.add(id, { ...action_, ...data_ }, status);
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
}
