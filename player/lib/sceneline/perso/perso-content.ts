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

interface MoveContentProps {
	id: PersoId;
	target: undefined | boolean | PersoId;
	order?: string | number;
	zoom: number;
	state: StateAction;
}

export class PersoContent extends PersoHandler {
	positions = new Map<PersoId, Map<PersoId, Position>>();

	move({ id, target, order, zoom, state }: MoveContentProps) {
		if (!this.store.has(id)) return;
		const parent = typeof target === 'string' ? target : this.store.get(id).parent;
		const oldPositions = this.#getSiblingPositions(id);

		// if (!oldPositions.size) return; // <- à verifier
		this.#positionsRenderState(id, state);
		this.#moveContent(id, target, order);

		// update this.positions, render

		//temp

		this.#nodePositionsUpdate(parent);
		console.log(this.store.get(parent));

		const newPositions = this.#getSiblingPositions(id);
		// this._positionsInitTransitions(id, zoom, oldPositions, newPositions);
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

	#getSiblingPositions(id: PersoId) {
		const parent = this.store.get(id);
		const positions = new Map<string, Position>();
		if (parent.content.size > 1) {
			parent.content.forEach((childId) => {
				const element = this.store.get(childId);
				positions.set(childId, element.node.getBoundingClientRect());
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
		id: PersoId,
		zoom: number,
		oldPositions: Map<PersoId, Position>,
		newPositions: Map<PersoId, Position>
	) {
		const parent = this.store.get(id);
		parent.content.forEach((childId) => {
			this.#positionsFromTo(childId, zoom);
		});
	}

	#positionsFromTo(id: PersoId, zoom: number) {}
}

interface Position {
	x: number;
	y: number;
	width: number;
	height: number;
}
