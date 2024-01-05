/* 
manipuler content d'un perso

-> 
- add 
- move
- remove

- pre-update
  - prend les positions de chaque élément (sauf add en fin de liste )
- update
  - va chercher les nodes 
  - ordonne les nodes
  - cree un fragment
  - prepare les transitions
    - lit les nouvelles postions
    - crée les transitions avec
  - applique le contenu

cycle : si des insertions ont lieu plusieurs fois lors d'un meme cycle, il y a des recalculs inutiles, voire erronés (un transform a déjà été calculé, un autre est appliqué ?
  -> comme move dans actionner
  
  les calculs seront faits au raf, un signal indique qu'il faut lancer un calcul
  )
*/

import { PersoId, StateAction } from '~/main';
import { PersoHandler } from './perso-handler';

const transitionType = {
	TRANSITION: 'transition',
	STRAP: 'strap',
};

interface MoveContentProps {
	id: PersoId;
	target: undefined | boolean | PersoId;
	order?: string | number;
	zoom: number;
	state: StateAction;
}
export class PersoContent2 extends PersoHandler {
	moves = new Map<PersoId, Set<PersoId>>();

	// set changes list
	atMove({ id, target, order }: Partial<MoveContentProps>) {
		const perso = this.store.get(id);
		if (!perso) return;
		const parent = typeof target === 'string' ? target : perso.parent;
		let origin: Set<PersoId>;
		let destination = new Set<PersoId>();
		switch (typeof target) {
			case 'undefined': // move sans transition
				{
					const addToContent = this.__addToContent({ id, parent, order: undefined });
					origin = addToContent.origin;
					destination = addToContent.destination;
				}
				return;

			case 'boolean': // forcer ajout / retrait
				if (target) {
					const addToContent = this.__addToContent({ id, parent, order: undefined });
					origin = addToContent.origin;
					destination = addToContent.destination;
				} else {
					origin = this.__deleteFromContent(id, parent);
					destination = origin;
				}
				break;
			case 'string': // destination désignée
				{
					const addToContent = this.__addToContent({ id, parent, order });
					origin = addToContent.origin;
					destination = addToContent.destination;
				}
				break;

			default:
				break;
		}

		origin && perso.parent && this.moves.set(perso.parent, origin);
		destination && parent && this.moves.set(parent, destination);
		console.log(id, { origin, destination });
		console.log('MOVES', ...this.moves);
	}

	// oldPositions
	// applyState
	// applyChildren
	// syncParentProps
	// return from-to
	atTick(zoom: number, state: StateAction) {
		if (!this.moves.size) return;

		const oldPositions = new Map<string, Position>();
		const newPositions = new Map<string, Position>();

		this.moves.forEach((content) => {
			content.forEach((id) => {
				const position = this.__getPosition(id, zoom);
				position && oldPositions.set(id, position);
			});
		});

		oldPositions.forEach((_, id) => {
			state.has(id) && this.render(id, state.get(id));
		});

		this.moves.forEach((content, parentId) => {
			this.__nodePositionsUpdate(parentId, content);
			content.forEach((id) => {
				const position = this.__getPosition(id, zoom);
				position && newPositions.set(id, this.__getPosition(id, zoom));
			});
		});

		const keys = oldPositions.size ? this.__positionsInitTransitions(zoom, oldPositions, newPositions) : null;

		this.moves.clear();
		return keys;
	}

	__nodePositionsUpdate(parentId: PersoId, content: Set<PersoId>) {
		const parent = this.store.get(parentId);

		while (parent.node.firstChild) {
			parent.node.removeChild(parent.node.firstChild);
		}

		let child: HTMLElement | SVGElement | DocumentFragment;
		if (content.size > 1) {
			child = document.createDocumentFragment();
			content.forEach((id) => {
				const element = this.store.get(id);
				element.parent = parentId;
				child.appendChild(element.node);
			});
		} else if (content.size === 1) {
			const element = this.store.get(content.values().next().value);
			if (element) {
				child = element.node;
				element.parent = parentId;
			}
		}

		if (child) parent.node.appendChild(child);
		parent.content = content;

		return;
	}

	/* 
	ne garde que le dernier id du content ? 
	
	*/
	__getPosition(id: PersoId, zoom: number) {
		const perso = this.store.get(id);
		if (!perso.parent) return null;
		const keepStyleProps = {
			width: perso.style?.width,
			height: perso.style?.height,
		};
		const transform = {
			x: perso.style?.x * zoom || 0,
			y: perso.style?.y * zoom || 0,
		};
		const rect = perso.node.getBoundingClientRect();
		return { rect, transform, keepStyleProps };
	}

	__positionsInitTransitions(
		zoom: number,
		oldPositions: Map<PersoId, Position>,
		newPositions: Map<PersoId, Position>
	) {
		const keys = new Map<
			PersoId,
			{ id: PersoId; from: Point & Size; to: Point & Size; keepStyleProps: Size; type: string; name: string }
		>();

		oldPositions.forEach((position, childId) => {
			const newPosition = newPositions.get(childId);
			if (!newPosition) return;
			const { from, to } = positionsFromTo(childId, zoom, position, newPosition);
			this.render(childId, { style: from });
			keys.set(childId, {
				id: childId,
				from,
				to,
				keepStyleProps: position.keepStyleProps,
				type: transitionType.TRANSITION,
				name: 'move',
			});
		});
		return keys;
	}

	__deleteFromContent(id: PersoId, parent: PersoId) {
		const content: Set<PersoId> = this.moves.has(parent)
			? this.moves.get(parent)
			: this.store.get(parent)?.content;
		if (!content) return null;

		const origin = new Set(content);
		origin.delete(id);
		this.store.get(id).parent = null;
		return origin;
	}

	__addToContent({ id, parent, order }) {
		const perso = this.store.get(id);
		let origin: Set<PersoId> | undefined;
		let destination = new Set<PersoId>();

		const isInContent = perso.parent === parent;
		const content = new Set<PersoId>(
			this.moves.get(parent) || this.store.get(parent)?.content || new Set<PersoId>()
		);
		isInContent && content.delete(id);

		if (perso.parent && !isInContent) {
			origin = this.__deleteFromContent(id, perso.parent);
			parent && (perso.parent = parent);
		}

		switch (typeof order) {
			case 'number': {
				const place = Math.min(order, content.size);
				const newContent = Array.from(content).toSpliced(place, 0, id);
				destination = new Set(newContent);
			}

			case 'string': {
				switch (order) {
					case 'first':
						destination = new Set([id, ...content]);
						break;
					case 'middle':
						{
							const half = Math.ceil(content.size / 2);
							const newContent = Array.from(content).toSpliced(half, 0, id);
							destination = new Set(newContent);
						}
						break;

					case 'last':
					default:
						destination = new Set(content);
						if (isInContent) destination.delete(id);
						destination.add(id);
						break;
				}
				break;
			}
			case 'undefined':
			default:
				destination = new Set(content);
				destination.add(id);
				break;
		}

		return { origin, destination };
	}
}

export class PersoContent extends PersoContent2 {
	positions = new Map<PersoId, Map<PersoId, Position>>();

	move({ id, target, order, zoom, state }: MoveContentProps) {
		if (!this.store.has(id)) return;
		const parent = typeof target === 'string' ? target : this.store.get(id).parent;

		const oldPositions = this.#getSiblingPositions(id, parent, zoom);
		this.#positionsRenderState(id, state);
		this.#moveContent(id, target, order);
		this.#nodePositionsUpdate(parent);

		const newPositions = this.#getSiblingPositions(id, parent, zoom);

		return oldPositions.size ? this.#positionsInitTransitions(parent, zoom, oldPositions, newPositions) : null;
	}

	#moveContent(id: PersoId, target: undefined | boolean | PersoId, order?: string | number) {
		const perso = this.store.get(id);
		switch (typeof target) {
			case 'undefined':
				// move sans transition
				this.#removeFromContent(id);
				this.#addToContent(id, perso.parent, order);
				return;

			case 'boolean':
				if (target) {
					this.#removeFromContent(id);
					this.#addToContent(id, perso.parent, order);
				} else {
					this.#removeFromContent(id);
				}
				break;
			case 'string':
				this.#addToContent(id, target, order);
				if (perso.parent && perso.parent !== target) this.#removeFromContent(id);
				perso.parent = target;
				break;

			default:
				break;
		}
	}

	#addToContent(id: PersoId, target: PersoId, order?: string | number) {
		const perso = this.store.get(id);
		perso.parent = target;
		const parent = this.store.get(target);
		parent.content.delete(id);

		switch (typeof order) {
			case 'undefined':
				parent.content.add(id);

				break;
			case 'number':
				{
					const place = Math.min(order, parent.content.size);
					parent.content.delete(id);
					const newContent = Array.from(parent.content).toSpliced(place, 0, id);
					parent.content = new Set(newContent);
				}
				break;
			case 'string':
				switch (order) {
					case 'first':
						parent.content = new Set([id, ...parent.content]);
						break;
					case 'last':
						parent.content.add(id);
						console.log('addToContent last-2', parent.content);
						break;
					case 'middle':
						{
							const half = Math.ceil(parent.content.size / 2);
							const newContent = Array.from(parent.content).toSpliced(half, 0, id);
							parent.content = new Set(newContent);
						}
						break;

					default:
						parent.content.add(id);
						break;
				}

				break;
			default:
				break;
		}
	}

	#removeFromContent(id: PersoId) {
		const perso = this.store.get(id);
		if (perso.parent) {
			const parent = this.store.get(perso.parent);
			parent.content.delete(perso.id);

			// remove node
		}
	}

	#getSiblingPositions(id: PersoId, target: PersoId, zoom: number) {
		const parent = this.store.get(target);

		const positions = new Map<string, Position>();
		if (parent.content.size) {
			parent.content.forEach((childId) => {
				const perso = this.store.get(childId);
				const keepStyleProps = {
					width: perso.style?.width,
					height: perso.style?.height,
				};

				const transform = {
					x: perso.style?.x * zoom || 0,
					y: perso.style?.y * zoom || 0,
				};
				const rect = perso.node.getBoundingClientRect();
				positions.set(childId, { rect, transform, keepStyleProps });
			});
		}
		return positions;
	}

	#positionsRenderState(id: PersoId, state: StateAction) {
		state.has(id) && this.render(id, state.get(id));
		const parent = this.store.get(id);
		parent.content.forEach((childId) => state.has(childId) && this.render(childId, state.get(childId)));
	}

	#nodePositionsUpdate(parentId: PersoId) {
		const parent = this.store.get(parentId);
		while (parent.node.firstChild) {
			parent.node.removeChild(parent.node.firstChild);
		}

		let child: HTMLElement | SVGElement | DocumentFragment;

		if (parent.content.size > 1) {
			child = document.createDocumentFragment();
			parent.content.forEach((id) => {
				const element = this.store.get(id);
				child.appendChild(element.node);
			});
		} else if (parent.content.size === 1) {
			const element = this.store.get(parent.content.values().next().value);
			element && (child = element.node);
		}

		if (child) parent.node.appendChild(child);

		return;
	}

	#positionsInitTransitions(
		targetId: PersoId,
		zoom: number,
		oldPositions: Map<PersoId, Position>,
		newPositions: Map<PersoId, Position>
	) {
		// const parent = this.store.get(targetId);
		const keys = new Map<
			PersoId,
			{ id: PersoId; from: Point & Size; to: Point & Size; keepStyleProps: Size; type: string; name: string }
		>();

		oldPositions.forEach((position, childId) => {
			const newPosition = newPositions.get(childId);
			if (!newPosition) return;
			const { from, to } = positionsFromTo(childId, zoom, position, newPosition);
			this.render(childId, { style: from });
			keys.set(childId, {
				id: childId,
				from,
				to,
				keepStyleProps: position.keepStyleProps,
				type: transitionType.TRANSITION,
				name: 'move',
			});
		});
		return keys;
	}
}

interface Size {
	width: number | string;
	height: number | string;
}
interface Point {
	x: number;
	y: number;
}
interface Position {
	rect: Point & Size;
	transform: Point;
	keepStyleProps: Size;
}

type KeyT<T extends Record<string, any>> = Record<keyof T, any>;

function applyZoom<KeyT>(obj: KeyT, zoom: number): KeyT {
	const zobj = {} as Record<keyof KeyT, any>;
	for (const p in obj) typeof obj[p] === 'number' ? (zobj[p] = (obj[p] as number) * zoom) : (zobj[p] = obj[p]);
	return zobj;
}

function positionsFromTo(id: PersoId, zoom: number, oldPosition: Position, newPosition: Position) {
	// console.log({ id, oldPosition, newPosition });

	const from = applyZoom(
		{
			x: oldPosition.rect.x - newPosition.rect.x + oldPosition.transform.x,
			y: oldPosition.rect.y - newPosition.rect.y + oldPosition.transform.y,
			width: oldPosition.rect.width,
			height: oldPosition.rect.height,
		},
		1 / zoom
	);

	const to = applyZoom(
		{
			x: 0,
			y: 0,
			width: newPosition.rect.width,
			height: newPosition.rect.height,
		},
		1 / zoom
	);
	return { from, to };
}
