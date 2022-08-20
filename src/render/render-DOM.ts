import { PersoStore } from './create-perso';
import { diff } from '../common/utils';

import type { Action, Update } from '../types';

export function createRender(store: PersoStore) {
	return function renderToDOM(update: Update) {
		for (const id in update) {
			const perso = store.getPerso(id);

			if (perso) {
				const up: Partial<Action> = diff(perso.prec, update[id]);
				if (up) {
					perso.prec = { ...perso.prec, ...update[id] };
					perso.style = { ...perso.style, ...up.style };
					perso.update(up);
				}
			}
		}
	};
}
