import { Txt } from './text';
import { PersoType } from '../../types';

import type {
	PersoDef,
	PersoId,
	PersoImgDef,
	PersoLayer,
	PersoNode,
	PersoSprite,
	PersoText,
	PersoVideo,
} from '../../types';
import { Layer } from './layer';
import { Sprite } from './sprite';
import { Video } from './video';

export function createPersoBase(id: PersoId, perso: PersoDef) {
	const tag = perso.initial?.tag || 'div';
	let node = document.createElement(tag);

	const persoNode = perso as PersoNode;
	switch (perso.type) {
		case PersoType.TEXT:
			const text = new Txt();
			text.update(perso.initial.content);
			node.appendChild(text.node);
			(persoNode as PersoText).child = text;
			break;
		case PersoType.IMG:
		case PersoType.SPRITE:
			const sprite = new Sprite(perso);
			node = sprite.node;

			(persoNode as PersoSprite).update = sprite.update;
			break;
		case PersoType.VIDEO:
			const video = new Video(perso);
			node = video.node;
			(persoNode as PersoVideo).update = video.update;
			break;
		case PersoType.LAYER:
			//  un layer n'est pas initialisé avec un contenu
			const layer = new Layer(node);
			(persoNode as PersoLayer).child = layer;
			break;
		default:
			break;
	}
	persoNode.id = id;
	persoNode.matrix = null;
	node.id = id;
	persoNode.node = node;
	return persoNode;
}
