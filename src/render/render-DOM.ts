import { PersoStore } from './create-perso';
import { diff } from '../common/utils';

import type { Update } from '../types';

export function createRender(store: PersoStore) {
	return function renderToDOM(update: Update) {
		for (const id in update) {
			const perso = store.getPerso(id);

			if (perso) {
				// le diff pourrait etre réalisé dans queue ?
				const up = diff(perso.prec, update[id]);
				// id == 'third' && console.log(update[id]);
				// id == 'third' && console.log(up);

				perso.prec = { ...update[id] };
				if (up) {
					perso.style = { ...perso.style, ...up.style };
					perso.update(up);
				}
			}
		}
	};
}
