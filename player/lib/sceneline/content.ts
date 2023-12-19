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

import { PersoId, PersoNode, StateAction } from '~/main';
import { Persos } from './perso-store';

/* 
si Content a accès à persos, pas besoin de le passer dans les méthodes.
il doit avoir acces à la classe Perso
*/
export class Content extends Persos {
	positions = new Map<PersoId, Map<PersoId, Position>>();

	addContent(id: PersoId, to: PersoId, order?: string | number) {
		const child = this.store.get(id);
		const parent = this.store.get(to);
		parent.content.add(id);
		child.parent = to;

		switch (typeof order) {
			case 'undefined':
				parent.content.add(id);
				break;
			case 'string':
				switch (order) {
					case 'first':
						parent.content = new Set([id, ...parent.content]);
						break;
					case 'last':
						parent.content.add(id);
						break;
					case 'middle':
						{
							const half = Math.ceil(parent.content.size / 2);
							const newContent = Array.from(parent.content).splice(half, 0, id);
							parent.content = new Set(newContent);
						}
						break;

					default:
						break;
				}

				break;

			case 'number':
				{
					const newContent = Array.from(parent.content).splice(order, 0, id);
					parent.content = new Set(newContent);
				}
				break;
		}
	}
	move() {}
	remove() {}

	update(id: PersoId, zoom: number, state: StateAction) {
		const oldPositions = this._positionsBeforeUpdate(id);
		this._positionsRenderState(id, state);
		const newPositions = this._positionsUpdate(id, oldPositions);
		this._positionsInitTransitions(id, zoom, oldPositions, newPositions);
	}

	_positionsBeforeUpdate(id: PersoId) {
		const parent = this.store.get(id);
		const oldPositions = new Map<string, Position>();
		if (parent.content.size > 1) {
			parent.content.forEach((childId) => {
				const element = this.store.get(childId);
				oldPositions.set(childId, element.node.getBoundingClientRect());
			});
		}
		return oldPositions;
	}

	_positionsRenderState(id: PersoId, state: StateAction) {
		state.has(id) && this.render(id, state.get(id));
		const parent = this.store.get(id);
		parent.content.forEach((childId) => state.has(childId) && this.render(childId, state.get(childId)));
	}

	_positionsUpdate(id: PersoId, oldPositions: Map<PersoId, Position>) {
		const parent = this.store.get(id);
		let child: HTMLElement | SVGElement | DocumentFragment;
		const newPositions = new Map<string, Position>();

		if (parent.content.size > 1) {
			child = document.createDocumentFragment();
			parent.content.forEach((id) => {
				const element = this.store.get(id);
				child.appendChild(element.node);
			});
		} else {
			child = parent.content.values().next().value;
		}
		parent.node.appendChild(child);

		if (oldPositions.size) {
			parent.content.forEach((id) => {
				const element = this.store.get(id);
				newPositions.set(id, element.node.getBoundingClientRect());
			});
		}
		return newPositions;
	}

	_positionsInitTransitions(id: PersoId, zoom: number, oldPositions, newPositions) {
		const parent = this.store.get(id);
		parent.content.forEach((childId) => {
			this.positionsFromTo(childId, zoom);
		});
	}

	positionsFromTo(id: PersoId, zoom: number) {}
}

interface Position {
	x: number;
	y: number;
	width: number;
	height: number;
}
