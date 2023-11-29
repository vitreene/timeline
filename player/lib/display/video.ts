import { Action, PersoVideoDef } from '~/main';

// Il n'ya pas besoin de spécificité de video, tout est géré ailleurs
// TODO gestion des tracks

export class Video {
	node = null;

	constructor(perso: PersoVideoDef) {
		this.node = perso.media;
	}

	// eventuellement pour changer la source ?
	update(update: Action['broadcast']) {
		return null;
	}
}
