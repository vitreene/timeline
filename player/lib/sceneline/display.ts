/* 
construire et stocker les persos
alimenter le renderer, mettre en dependance?
*/
import { matrix } from '../common/matrix';

import { createPersoBase } from '../display/base';
import { addSuffix, toKebabCase } from '../common/utils';
import { CONTAINER, ROOT, stage } from './constants';
import { transformAliases, transformKeys } from './transform-types';

import type {
	Action,
	ActionClassList,
	PersoId,
	PersoNode,
	StateAction,
	Style,
	PersoStore,
	ImgAction,
	Img,
	Content,
	Store,
	PersoDef,
} from '~/main';
import { PersoType as P } from '~/main';
import type { Matrix2D } from './transform-types';
import { Layer } from '~/display/layer';

export class Display {
	app: HTMLElement;
	persos = new Map<PersoId, PersoNode>();
	zoom = 1;
	removeResize: () => void;

	constructor(appId: string, store: Store) {
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

	initPersos(store: Store) {
		for (const id in store) {
			if (store[id].type === P.SOUND) continue;
			const perso = createPersoBase(id, store[id] as PersoDef);
			this.render(perso, perso.initial);
			this.persos.set(id, perso);
		}
	}

	root = () => {
		const rootPerso = this.persos.get(ROOT);
		this.render(rootPerso, rootPerso.initial);
		this.app.appendChild(rootPerso.node);
	};

	renderer = (actions: StateAction) => {
		actions.forEach((action, id) => {
			const perso = this.persos.get(id);
			perso && this.render(perso, action);
		});
	};

	/* 
	TODO Il faudrait filtrer les actions pour que seules celles utiles passent	
	ou bien, definir un case pour les media √
	*/

	render = <T extends PersoNode>(perso: T, action: Action | ImgAction) => {
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
				/* 				
				case 'move': {
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

						// perso.id === 'video01' && console.log('video01***>', action.style, { transform, style });

						updateStyle(perso.node, { ...(transform && { transform }), ...style }, this.zoom);
						// perso.id === 'video01' && console.log(perso.node);
					}
					break;
				case 'className':
					updateClassList(perso.node, action.className);
					break;
				case 'func':
					typeof action[attr] === 'function' && action[attr]();
					break;
				default:
					// fait passer toutes les autres props ; souhaitable ?
					// filtrer les seules aui devraient atteindre le composant ?
					// perso.type === 'video' && console.log(action, attr);

					// 'update' in perso && perso.update(action[attr]);
					// 'child' in perso && 'update' in perso.child && perso.child.update(action[attr]);
					break;
			}
		}
	};

	reset = () => {
		this.persos.forEach((perso, id) => {
			[...perso.node.attributes].forEach((attr) => perso.node.removeAttribute(attr.name));
			perso.node.id = id;
			perso.style = {};
			perso.transform = null;
			if ('child' in perso && perso.child instanceof Layer) {
				console.log('RESET', id);
				perso.child.reset();
			}
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

function transformStyle(perso: PersoNode, toTransform, zoom) {
	// perso.id === 'video01' && console.log('transform', transform);

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
			// node.id === 'video01' && console.log(value, node.getAttribute('style'));
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
