import { Txt } from './text';
import { PersoType } from '../../types';

import type { PersoDef, PersoId, PersoImgDef, PersoNode } from '../../types';
import { Layer } from './layer';
import { Sprite } from './sprite';

export function createPersoBase(id: PersoId, perso: PersoDef) {
	const node = document.createElement(perso.initial?.tag || 'div');
	node.id = id;
	const persoNode = perso as PersoNode;
	switch (perso.type) {
		case PersoType.TEXT:
			const text = new Txt();
			text.update(perso.initial.content);
			node.appendChild(text.node);
			persoNode.child = text;
			break;
		case PersoType.IMG:
		case PersoType.SPRITE:
			const sprite = new Sprite(perso);
			// sprite.update((perso as PersoImgDef).initial.content);
			node.appendChild(sprite.node);
			persoNode.child = sprite;
			break;
		case PersoType.LAYER:
			//  un layer n'est pas initialisé avec un contenu
			const layer = new Layer(node);
			persoNode.child = layer;
			break;
		default:
			break;
	}
	persoNode.id = id;
	persoNode.matrix = null;
	persoNode.node = node;
	return persoNode;
}
