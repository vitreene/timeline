import { Txt } from './txt';
import { Layer } from './layer';
import { PersoElementType } from '../../types';
import { Sprite } from './sprite';

export function createContent(type: Omit<PersoElementType, PersoElementType.SOUND>, parentNode: HTMLElement) {
	let child = null;
	switch (type) {
		case PersoElementType.TEXT:
			child = new Txt();
			break;
		case PersoElementType.LAYER:
			child = new Layer(parentNode);
			break;
		case PersoElementType.SPRITE:
			child = new Sprite();
			break;
		default:
			child = null;
	}

	if (child) {
		if (type !== PersoElementType.LAYER) {
			parentNode.appendChild(child.node);
		}
	} else {
		console.warn(`le type ${type} n'est pas supporté`);
	}
	return child;
}
