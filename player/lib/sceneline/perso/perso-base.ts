import { PersoType as P } from '~/main';
import { createPersoBase } from '../../display/base';

import type { PersoDef, PersoId, PersoNode, Store } from '~/main';

export class PersoBase {
	store = new Map<PersoId, PersoNode>();

	addPersos(store: Store) {
		for (const id in store) {
			if (store[id].type === P.SOUND) continue;
			const perso = createPersoBase(id, store[id] as PersoDef);
			this.store.set(id, perso);
		}
	}
}
