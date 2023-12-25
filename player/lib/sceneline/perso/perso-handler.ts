import type { PersoNode } from '~/main';
import { PersoRender } from './perso-store';

export class PersoHandler extends PersoRender {
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
