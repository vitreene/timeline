import { Store } from '~/main';
import { PersoContent } from './perso-content';

export class Persos extends PersoContent {
	constructor(store: Store) {
		super();
		this.addPersos(store);
	}

	addPersos(store: Store) {
		super.addPersos(store);
		this.store.forEach((perso, id) => {
			this.render(id, perso.initial);
			this.registerPersoEvents(perso);
		});
	}
}
