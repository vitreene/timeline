import { Txt } from './txt';
import { Layer } from './layer';
import { PersoElementType } from '../../types';
import { Sprite } from './sprite';
import { Thr3d } from './thr3d';

interface CreateContentOptions {
	parentNode: HTMLElement;
	scene: any;
}

export function createContent(type: Omit<PersoElementType, PersoElementType.SOUND>, options) {
	let child = null;
	switch (type) {
		case PersoElementType.TEXT:
			child = new Txt();
			break;
		case PersoElementType.LAYER:
			child = new Layer(options.parentNode);
			break;
		case PersoElementType.SPRITE:
			child = new Sprite();
			break;
		case PersoElementType.THR3D:
			child = new Thr3d(options);
			break;
		default:
			child = null;
	}

	if (child) {
		if (type !== PersoElementType.LAYER) {
			options.parentNode.appendChild(child.node);
		}
	} else {
		console.warn(`le type ${type} n'est pas supporté`);
	}
	return child;
}
