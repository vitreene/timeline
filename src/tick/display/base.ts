import { Txt } from './text';
import { PersosTypes } from '../types';

import type { PersoDef, PersoId, PersoNode, PersoSprite } from '../types';
import { Layer } from './layer';
import { Sprite } from './sprite';

export function createPersoBase(id: PersoId, perso: PersoDef) {
	const node = document.createElement(perso.initial.tag || 'div');
	node.id = id;
	const persoNode = perso as PersoNode;
	switch (perso.type) {
		case PersosTypes.TEXT:
			const text = new Txt();
			text.update(perso.initial.content);
			node.appendChild(text.node);
			persoNode.child = text;
			break;
		case PersosTypes.SPRITE:
			const sprite = new Sprite();
			sprite.update((perso as PersoSprite).initial);
			node.appendChild(sprite.node);
			persoNode.child = sprite;
			break;
		case PersosTypes.LAYER:
			//  un layer n'est pas initialisé avec un contenu
			const layer = new Layer(node);
			persoNode.child = layer;
			break;
		default:
			break;
	}
	persoNode.matrix = null;
	persoNode.node = node;
	return persoNode;
}
