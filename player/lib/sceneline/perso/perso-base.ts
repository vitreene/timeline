import { PersoType as P } from '~/main';
import { createPersoBase } from '../../display/base';

import type { PersoDef, PersoId, PersoNode, Store } from '~/main';
import { Layer } from '~/display/layer';

export class PersoBase {
	store = new Map<PersoId, PersoNode>();

	addPersos(store: Store) {
		for (const id in store) {
			if (store[id].type === P.SOUND) continue;
			const perso = createPersoBase(id, store[id] as PersoDef);
			this.store.set(id, perso);
		}
	}

	reset = () => {
		this.store.forEach((perso, id) => {
			[...perso.node.attributes].forEach((attr) => perso.node.removeAttribute(attr.name));
			perso.node.id = id;
			perso.style = {};
			perso.transform = null;
			perso.parent = null;
			if ('child' in perso && perso.child instanceof Layer) {
				console.log('RESET', id);
				perso.child.reset();
			}
		});
	};
}
