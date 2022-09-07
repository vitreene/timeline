import { Txt } from './txt';
import { Layer } from './layer';
import { PersoElementType } from '../../types';

export function createContent(type: Omit<PersoElementType, PersoElementType.SOUND>, parentNode: HTMLElement) {
	let child = null;
	switch (type) {
		case PersoElementType.TEXT:
			child = new Txt();
			break;
		case PersoElementType.LAYER:
			child = new Layer(parentNode);
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
