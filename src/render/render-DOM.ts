import { createContent, PersoStore } from './create-perso';
import { diff } from '../common/utils';

import type { Update, PersoItem } from '../types';

// RENDER ////////////
// function createQueue(store) {
// 	const render = createRender(store);
// 	return new QueueActions(render);
// }

export function createRender(store: PersoStore) {
	return function renderToDOM(update: Update) {
		for (const id in update) {
			const perso = store.getPerso(id);
			if (perso) {
				const up = diff(perso.prec, update[id]);
				perso.prec = { ...update[id] };

				if (up) {
					Object.assign(perso.style, up.style);
					perso.update(up);
					if (up.content) {
						perso.content = up.content;
						appendContent(perso);
					}
				}
			}
		}
	};
}

function appendContent(perso: PersoItem) {
	const _content = createContent(perso.content);
	if (_content) {
		if (perso.node.hasChildNodes()) {
			perso.node.replaceChild(_content, perso.node.firstChild);
		} else {
			perso.node.appendChild(_content);
		}
	}
}
