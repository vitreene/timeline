import { diff } from '../common/utils';

import { Action } from '../types';
import { PersoStore } from './create-perso';

// RENDER ////////////
let precUpdate = {};
export function createRender(store: PersoStore) {
	return function render(update: Partial<Action>) {
		for (const id in update) {
			const up = diff(precUpdate[id], update[id]);
			precUpdate[id] = { ...update[id] };
			if (up) {
				const node = store.getPerso(id);
				if (node) {
					node.update(up);
					up.content && (node.content = up.content);
				}
			}
		}
	};
}
