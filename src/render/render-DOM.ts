import { diff } from '../common/utils';

import { Action, Content, PersoItem } from '../types';
import { createContent, PersoStore } from './create-perso';

// RENDER ////////////
let precUpdate = {};
export function createRender(store: PersoStore) {
	return function render(update: Partial<Action>) {
		for (const id in update) {
			const up = diff(precUpdate[id], update[id]);
			precUpdate[id] = { ...update[id] };
			if (up) {
				const perso = store.getPerso(id);
				if (perso) {
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
