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

interface AddContentProps {
	id: PersoId;
	parent: PersoId;
	order?: string | number;
	delta: number;
	duration: number;
}

interface MoveContentProps {
	id: PersoId;
	target: undefined | boolean | PersoId;
	order?: string | number;
	zoom: number;
	state: StateAction;
	delta: number;
	duration: number;
}

interface DeltaMove {
	id: PersoId;
	delta: number;
	duration: number;
}
export class PersoContent extends PersoHandler {
	moves = new Map<PersoId, Set<DeltaMove>>();

	// set changes list
	atMove({ id, target, order, duration = 0, delta = 0 }: Partial<MoveContentProps>) {
		const perso = this.store.get(id);
		if (!perso) return;
		const parent = typeof target === 'string' ? target : perso.parent;

		let origin: Set<DeltaMove>;
		let destination = new Set<DeltaMove>();
		switch (typeof target) {
			case 'undefined': // move sans transition
				{
					const addToContent = this.__addToContent({ id, parent, order: undefined, duration, delta });
					origin = addToContent.origin;
					destination = addToContent.destination;
				}
				return;

			case 'boolean': // forcer ajout / retrait
				if (target) {
					const addToContent = this.__addToContent({ id, parent, order: undefined, duration, delta });
					origin = addToContent.origin;
					destination = addToContent.destination;
				} else {
					origin = this.__deleteFromContent(id, parent);
					destination = origin;
					console.log('DELETE', id, origin);
				}
				break;
			case 'string': // destination désignée
				{
					const addToContent = this.__addToContent({ id, parent, order, duration, delta });
					origin = addToContent.origin;
					destination = addToContent.destination;
				}
				break;

			default:
				break;
		}

		/* 
		items : set<id>
		delta: number -> commun ; il peut y en avoir plusieurs si mode = seek
		duration: number -> personnalisé par id
		*/
		origin && perso.parent && this.moves.set(perso.parent, origin);
		destination && parent && this.moves.set(parent, destination);
	}

	// oldPositions
	// applyState
	// applyChildren
	// syncParentProps
	// return from-to
	atTick(zoom: number, state: StateAction) {
		if (!this.moves.size) return;
		console.log('atTick MOVES', ...this.moves);

		const oldPositions = new Map<string, Position>();
		const newPositions = new Map<string, Position>();

		this.moves.forEach((content) => {
			content.forEach(({ id, delta, duration }) => {
				const position = this.__getPosition(id, zoom);
				position && oldPositions.set(id, { ...position, delta, duration });
			});
		});

		oldPositions.forEach((_, id) => {
			state.has(id) && this.render(id, state.get(id));
		});

		this.moves.forEach((content, parentId) => {
			this.__nodePositionsUpdate(parentId, content);
			content.forEach(({ id, delta, duration }) => {
				const position = this.__getPosition(id, zoom);
				position && newPositions.set(id, { ...position, delta, duration });
			});
		});

		const keys = oldPositions.size ? this.__positionsInitTransitions(zoom, oldPositions, newPositions) : null;

		this.moves.clear();
		return keys;
	}

	__nodePositionsUpdate(parentId: PersoId, content: Set<DeltaMove>) {
		const parent = this.store.get(parentId);

		while (parent.node.firstChild) {
			parent.node.removeChild(parent.node.firstChild);
		}

		let child: HTMLElement | SVGElement | DocumentFragment;
		if (content.size > 1) {
			child = document.createDocumentFragment();
			content.forEach((move) => {
				const element = this.store.get(move.id);
				element.parent = parentId;
				child.appendChild(element.node);
			});
		} else if (content.size === 1) {
			const element = this.store.get(content.values().next().value.id);
			if (element) {
				child = element.node;
				element.parent = parentId;
			}
		}

		if (child) parent.node.appendChild(child);
		const parentContent = new Set<PersoId>();
		content.forEach((move) => parentContent.add(move.id));
		parent.content = parentContent;

		return;
	}

	__getPosition(id: PersoId, zoom: number) {
		const perso = this.store.get(id);
		if (!perso.parent || !perso.node.isConnected) return null;
		const keepStyleProps = {
			width: perso.style?.width,
			height: perso.style?.height,
		};
		const transform = {
			x: perso.style?.x * zoom || 0,
			y: perso.style?.y * zoom || 0,
		};
		const rect = perso.node.getBoundingClientRect();
		console.log(id, rect.x, rect.y);

		return { rect, transform, keepStyleProps };
	}

	__positionsInitTransitions(
		zoom: number,
		oldPositions: Map<PersoId, Position>,
		newPositions: Map<PersoId, Position>
	) {
		const keys = new Map<
			PersoId,
			{
				id: PersoId;
				from: Point & Size;
				to: Point & Size;
				keepStyleProps: Size;
				type: string;
				name: string;
				delta: number;
				duration: number;
			}
		>();

		oldPositions.forEach((position, childId) => {
			const newPosition = newPositions.get(childId);
			if (!newPosition) return;
			// console.log('__positionsInitTransitions', childId, position, newPosition);

			const { from, to } = positionsFromTo(childId, zoom, position, newPosition);
			// this.render(childId, { style: from });
			keys.set(childId, {
				id: childId,
				from,
				to,
				keepStyleProps: position.keepStyleProps,
				type: transitionType.TRANSITION,
				name: 'move',
				delta: position.delta,
				duration: position.duration,
			});
		});
		return keys;
	}

	getMovesFromParent(parent: PersoId) {
		const content = new Set<DeltaMove>();
		this.store.get(parent)?.content.forEach((id) => content.add({ id, duration: 0, delta: 0 }));
		return content;
	}

	__deleteFromContent(id: PersoId, parent: PersoId) {
		const content: Set<DeltaMove> = this.moves.has(parent)
			? this.moves.get(parent)
			: this.getMovesFromParent(parent);
		if (!content) return null;

		const origin = new Set(content);
		origin.forEach((element) => element.id === id && origin.delete(element));
		this.store.get(id).parent = null;
		return origin;
	}

	__addToContent({ id, parent, order, duration, delta }: AddContentProps) {
		const perso = this.store.get(id);
		const persoMove = { id, duration, delta };

		let origin: Set<DeltaMove> | undefined;
		let destination = new Set<DeltaMove>();

		const isInContent = perso.parent === parent;
		const content = new Set<DeltaMove>(
			this.moves.get(parent) || this.getMovesFromParent(parent) || new Set<DeltaMove>()
		);
		isInContent && content.forEach((element) => element.id === id && content.delete(element));

		if (perso.parent && !isInContent) {
			origin = this.__deleteFromContent(id, perso.parent);
			parent && (perso.parent = parent);
		}

		if (parent && !perso.parent) {
			perso.parent = parent;
			// persoMove.duration = -1;
		}

		switch (typeof order) {
			case 'number': {
				const place = Math.min(order, content.size);
				const newContent = Array.from(content).toSpliced(place, 0, persoMove);
				destination = new Set(newContent);
			}

			case 'string': {
				switch (order) {
					case 'first':
						destination = new Set(content).add(persoMove);
						break;
					case 'middle':
						{
							const half = Math.ceil(content.size / 2);
							const newContent = Array.from(content).toSpliced(half, 0, persoMove);
							destination = new Set(newContent);
						}
						break;

					case 'last':
					default:
						destination = new Set(content);
						if (isInContent) destination.forEach((element) => element.id === id && destination.delete(element));
						destination.add(persoMove);
						break;
				}
				break;
			}
			case 'undefined':
			default:
				destination = new Set(content);
				destination.add(persoMove);
				break;
		}

		return { origin, destination };
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
	delta: number;
	duration: number;
}

type KeyT<T extends Record<string, any>> = Record<keyof T, any>;

function applyZoom<KeyT>(obj: KeyT, zoom: number): KeyT {
	const zobj = {} as Record<keyof KeyT, any>;
	for (const p in obj) typeof obj[p] === 'number' ? (zobj[p] = (obj[p] as number) * zoom) : (zobj[p] = obj[p]);
	return zobj;
}

function positionsFromTo(id: PersoId, zoom: number, oldPosition: Position, newPosition: Position) {
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

	console.log({ id, oldPosition, newPosition, from });

	return { from, to };
}
