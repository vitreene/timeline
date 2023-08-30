import { Txt } from './txt';
import { Layer } from './layer';
import { Initial, THR3DTypes, SoundType, PersosTypes } from '../../../player/src/types';
import { Sprite } from './sprite';
import { Thr3d } from './thr3d';

interface CreateContentOptions {
	parentNode: HTMLElement;
	initial: Partial<Initial>;
}

type RegularPersoTypes = Omit<PersosTypes, SoundType.SOUND>;

const notAppended: RegularPersoTypes[] = [PersosTypes.LAYER];

export function createContent(type: RegularPersoTypes, options: CreateContentOptions) {
	let child: Txt | Layer | Thr3d | Sprite = null;
	switch (type) {
		case PersosTypes.TEXT:
			child = new Txt();
			break;
		case PersosTypes.SPRITE:
			child = new Sprite();
			break;
		case PersosTypes.LAYER:
			child = new Layer(options.parentNode);
			break;
		case THR3DTypes.THR3D_SCENE:
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
