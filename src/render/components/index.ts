import { Txt } from './txt';
import { Layer } from './layer';
import { Initial, PersoElementType, Thr3dSceneNode } from '../../types';
import { Sprite } from './sprite';
import { Thr3d } from './thr3d';

interface CreateContentOptions {
	parentNode: HTMLElement;
	// initial: Thr3dSceneNode['initial'];
	initial: Partial<Initial>;
}

type RegularPersoTypes = Omit<PersoElementType, PersoElementType.SOUND>;

const notAppended: RegularPersoTypes[] = [PersoElementType.LAYER /* , PersoElementType.THR3D_SCENE */];

export function createContent(type: RegularPersoTypes, options: CreateContentOptions) {
	let child: Txt | Layer | Thr3d | Sprite = null;
	switch (type) {
		case PersoElementType.TEXT:
			child = new Txt();
			break;
		case PersoElementType.SPRITE:
			child = new Sprite();
			break;
		case PersoElementType.LAYER:
			child = new Layer(options.parentNode);
			break;
		case PersoElementType.THR3D_SCENE:
			child = new Thr3d(options);
			break;
		default:
			child = null;
	}

	if (child) {
		if (!notAppended.includes(type)) {
			options.parentNode.appendChild(child.node);
		}
	} else {
		console.warn(`le type ${type} n'est pas supporté`);
	}
	return child;
}
