import { matrix } from '../../common/matrix';

import { PersoType as P } from '~/main';
import { createPersoBase } from '../../display/base';
import { addSuffix, toKebabCase } from '../../common/utils';

import { transformAliases, transformKeys } from '../transform-types';
import type { Matrix2D } from '../transform-types';
import type {
	PersoId,
	PersoNode,
	PersoDef,
	Action,
	ImgAction,
	Img,
	Content,
	ActionClassList,
	Style,
	Store,
} from '~/main';

// extends Map<PersoId, PersoNode>

class PersoBase {
	store = new Map<PersoId, PersoNode>();

	constructor(store: Store) {
		this.addPersos(store);
	}

	addPersos(store: Store) {
		for (const id in store) {
			if (store[id].type === P.SOUND) continue;
			const perso = createPersoBase(id, store[id] as PersoDef);
			this.store.set(id, perso);
		}
	}
}

export class PersoRender extends PersoBase {
	handler: (emit: any) => void = () => {
		console.log('handler');
	};

	constructor(store: Store) {
		super(store);
	}

	addPersos(store: Store) {
		super.addPersos(store);

		this.store.forEach((perso, id) => {
			this.render(id, perso.initial);
			this.registerPersoEvents(perso);
		});
	}

	renderAll(zoom: number) {
		this.store.forEach((perso: PersoNode) => {
			this.render(perso.id, { style: perso.style }, zoom);
			// TODO appliquer le zoom sur les composants enfants
			// if (perso.child.resize) perso.child.resize(this.zoom);
		});
	}

	render = (id: string, action: Action | ImgAction, zoom = 1) => {
		const perso = this.store.get(id);
		if (!perso) return;

		for (const attr in action) {
			switch (attr) {
				case 'content':
					if (perso.type === P.SPRITE || perso.type === P.IMG) {
						perso.update(action.content as Img);
					}
					if (perso.type === P.TEXT) {
						perso.child.update(action.content as Content);
					}
					break;

				case 'style':
					{
						perso.style = { ...perso.style, ...action.style };
						const style = {};
						const transformProps = {};
						for (const s in action.style) {
							if (transformKeys.includes(s)) transformProps[s] = action.style[s];
							else style[s] = action.style[s];
						}
						const transform = transformStyle(perso, transformProps, zoom);

						updateStyle(perso.node, { ...(transform && { transform }), ...style }, zoom);
					}
					break;
				case 'className':
					updateClassList(perso.node, action.className);
					break;
				case 'func':
					typeof action[attr] === 'function' && action[attr]();
					break;
				default:
					break;
			}
		}
	};

	addHandler(handler) {
		this.handler = handler;
	}

	registerPersoEvents(perso: PersoNode) {
		if (perso.emit) {
			console.log('registerPersoEvents', perso.emit);

			perso.node.dataset.id = perso.id;
			for (const ev in perso.emit) {
				perso.node.addEventListener(ev, this); //perso à la place ?
			}
		}
	}

	handleEvent = (event: Event) => {
		if (!(event.target instanceof HTMLElement)) {
			return;
		}
		const persoId = event.target.dataset.id;
		const perso = this.store.get(persoId);
		if (!perso) return;
		const emit = perso.emit[event.type];

		emit.name = persoId;

		emit.data = {
			...emit.data,
			emit: { e: event, type: event.type, id: persoId },
		};

		this.handler(emit);
	};
}

export function updateClassList(node: HTMLElement | SVGElement, actions: string | ActionClassList) {
	if (typeof actions === 'string') node.classList.add(...actions.split(' '));
	else {
		for (const action in actions) {
			const className = Array.isArray(actions[action]) ? actions[action] : actions[action].split(' ');
			node.classList[action](...className);
		}
	}
}

function transformStyle(perso: PersoNode, toTransform, zoom) {
	let matrice: Matrix2D[] = [];
	const transform = { ...perso.transform, ...toTransform };
	Object.entries(transform).forEach(([key, t]) => {
		const prop = transformAliases[key] || key;
		if (typeof t === 'number') {
			const z = zoomable[key] ? zoom : 1;
			// les déplacements ne doivent pas être influencés par le transform.scale
			const s = ['x', 'y', 'dx', 'dy'].includes(key) && transform.scale ? 1 / transform.scale : 1;
			matrice.push(matrix[prop](t * z * s));
		}
	});
	if (matrice.length) {
		const combine = matrix.combine(...matrice);
		perso.transform = { ...perso.transform, ...toTransform };
		return `matrix(${matrix.getStyleMatrix2d(combine)})`;
	}
}

function updateStyle(node: HTMLElement | SVGElement, style: Style, zoom: number) {
	Object.entries(style).forEach(([key, val]) => {
		if (val === undefined) {
			node.style.removeProperty(key);
		} else {
			const value = addSuffix(key, val, zoom);
			const prop = toKebabCase(key);
			node.style[prop] = value;
		}
	});
}

const zoomable = {
	translate: true,
	translateX: true,
	translateY: true,
	x: true,
	y: true,
	dX: true,
	dY: true,
	rotate: false,
	scale: false,
	scaleX: false,
	scaleY: false,
	skew: false,
	skewX: false,
	skewY: false,
};
