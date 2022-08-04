import { PersoStore } from './create-perso';

import { ROOT, INITIAL, DEFAULT_CHANNEL_NAME } from '../common/constants';

import type { AddEvent } from 'src/tracks';
import type { Store, Eventime } from '../types';

const root = document.getElementById('app');

export function createStore(persos: Store, addEvent: AddEvent): PersoStore {
	addInitialEvents(persos, addEvent);
	const store = new PersoStore(addEvent);
	for (const id in persos) {
		const perso = store.add(id, persos[id]);
		// Provisoire
		id === ROOT && root.appendChild(perso.node);
	}
	return store;
}

function addInitialEvents(persos: Store, addEvent: AddEvent) {
	for (const id in persos) {
		persos[id].actions[INITIAL] = persos[id].initial;
	}
	const event: Eventime = {
		channel: DEFAULT_CHANNEL_NAME,
		name: INITIAL,
		startAt: 0,
	};
	addEvent(event);
}
