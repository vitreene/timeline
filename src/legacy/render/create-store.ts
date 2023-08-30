import { StorePersos } from './create-perso';

import { ROOT, INITIAL, DEFAULT_CHANNEL_NAME, TRACK_PLAY } from '../../common/constants';

import type { AddEvent } from 'src/legacy/tracks';
import type { Store, Eventime, PersoStore } from '../../types';

const root = document.getElementById('app');

export function createStore(persos: PersoStore, addEvent: AddEvent): StorePersos {
	// addInitialEvents(persos, addEvent);
	const store = new StorePersos(addEvent);
	for (const id in persos) {
		const perso = store.add(id, persos[id]);
		// Provisoire
		id === ROOT && root.appendChild(perso.node);
	}
	return store;
}

function addInitialEvents(persos: PersoStore, addEvent: AddEvent) {
	for (const id in persos) {
		persos[id].actions[INITIAL] = persos[id].initial;
	}
	/* FIXME
	en ajoutant un event à 0 pour tout element, cela les force à changer d'aspect en cas de changement de tracks, meme s'il sont pas concernés.
il faudrait que cet event s'applique lors du premier montage de l'element.
comment le savoir ?
-> tenir le compte des éléments montés/démontés;
-> tester si l'element à un parent ?
	*/
	const event: Eventime = {
		channel: DEFAULT_CHANNEL_NAME,
		name: INITIAL,
		startAt: 0,
		track: TRACK_PLAY,
	};
	addEvent(event);
}
