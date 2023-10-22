/* 
construire et stocker les persos
alimenter le renderer, mettre en dependance?
*/
import { matrix } from '../common/matrix';

import { createPersoBase } from '../display/base';
import { addSuffix, toKebabCase } from '../common/utils';
import { CONTAINER, ROOT, stage } from './constants';

import { PersoType } from '../../types';
import { transformAliases, transformKeys } from './transform-types';

import type {
	Action,
	ActionClassList,
	PersoId,
	PersoNode,
	StateAction,
	PersoMediaStore,
	Style,
	SoundNode,
	PersoStore,
	ImgAction,
	Img,
	Content,
} from '~/main';
import type { Matrix2D } from './transform-types';

export class Display {
	app: HTMLElement;
	persos = new Map<PersoId, PersoNode>();
	zoom = 1;
	removeResize: () => void;

	constructor(appId: string, store: PersoMediaStore) {
		this.app = document.getElementById(appId);
		this.initPersos(store);
		this.root();
		this.initResize();
	}

	initResize() {
		const resizeObserver = new ResizeObserver((entries) => {
			const w = entries[0].contentBoxSize[0].inlineSize;
			const h = entries[0].contentBoxSize[0].blockSize;
			const hScene = (w / stage.width) * stage.height;
			const zoom = parseFloat((hScene > h ? h / stage.height : w / stage.width).toFixed(2));

			if (zoom === this.zoom) return;

			if (hScene >= h) {
				this.app.style.height = `${h}px`;
				this.app.style.width = `${stage.width * (h / stage.height)}px`;
			} else {
				this.app.style.height = `${stage.height * (w / stage.width)}px`;
				this.app.style.width = `${w}px`;
			}
			this.zoom = zoom;
			this.resize();
		});

		const container = document.getElementById(CONTAINER);
		resizeObserver.observe(container);
		this.removeResize = () => resizeObserver.unobserve(container);
	}

	resize = () =>
		requestAnimationFrame(() =>
			this.persos.forEach((perso: PersoNode) => {
				this.render(perso, { style: perso.style });
				// TODO appliquer le zoom sur les composants enfants
				// if (perso.child.resize) perso.child.resize(this.zoom);
			})
		);

	initPersos(store: PersoMediaStore) {
		for (const id in store) {
			// TODO envoyer sound dans son constructeur
			if (store[id].type === PersoType.SOUND) continue;

			const perso = createPersoBase(id, (store as PersoStore)[id]) as PersoNode;
			this.render(perso, perso.initial);
			this.persos.set(id, perso);
		}
	}

	root = () => {
		const root = this.persos.get(ROOT).node;
		this.app.appendChild(root);
	};

	renderer = (actions: StateAction) => {
		actions.forEach((action, id) => {
			const perso = this.persos.get(id);
			perso && this.render(perso, action);
		});
	};
	b;

	render = <T extends PersoNode>(perso: T, action: Action | ImgAction) => {
		for (const attr in action) {
			switch (attr) {
				case 'content':
					if (perso.type === PersoType.SPRITE || perso.type === PersoType.IMG) {
						perso.update(action.content as Img);
					}
					if (perso.type === PersoType.TEXT) {
						perso.child.update(action.content as Content);
					}
					break;
				/* 				case 'move': {
					const move = action.move;
					const parentId = typeof move === 'string' ? move : move.to;
					const layer = this.persos.get(parentId)?.child;
					
					if (layer instanceof Layer) {
						parentId && (perso.parent = parentId);
						const order = typeof move === 'object' ? move.order : undefined;
						layer.add(perso.node, order);
						layer.update(layer.content);
					}
				} */

				case 'style':
					{
						perso.style = { ...perso.style, ...action.style };
						const style = {};
						const transformProps = {};
						for (const s in action.style) {
							if (transformKeys.includes(s)) transformProps[s] = action.style[s];
							else style[s] = action.style[s];
						}
						const transform = transformStyle(perso, transformProps, this.zoom);
						updateStyle(perso.node, { transform, ...style }, this.zoom);
					}
					break;
				case 'className':
					updateClassList(perso.node, action.className);
					break;
				case 'action':
					action[attr]();
					break;
				default:
					break;
			}
		}
	};

	reset = () => {
		this.persos.forEach((perso, id) => {
			[...perso.node.attributes].forEach((attr) => perso.node.removeAttribute(attr.name));
			perso.node.id = id;
			this.render(perso, perso.initial);
		});
		this.root();
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

function transformStyle(perso: PersoNode, transform, zoom) {
	let matrice: Matrix2D[] = [];
	Object.entries({ ...perso.transform, ...transform }).forEach(([key, t]) => {
		const prop = transformAliases[key] || key;
		if (typeof t === 'number') {
			const z = zoomable[key] ? zoom : 1;
			matrice.push(matrix[prop](t * z));
		}
	});
	if (matrice.length) {
		const combine = matrix.combine(...matrice);
		perso.transform = { ...perso.transform, transform };
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
