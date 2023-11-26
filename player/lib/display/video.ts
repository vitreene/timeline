import { PAUSE, START, STOP } from '~/common/constants';
import { Action, PersoVideoDef } from '~/main';

// Dans cette version, pas possible de modifier la source video
// complexité inutle en l'état; il n'y a pas besoin de classe pour ceci ?
export class Video {
	node = null;
	duration: null;
	constructor(perso: PersoVideoDef) {
		this.node = perso.media;
		this.duration = perso.media.duration;
	}

	update(update: Action['broadcast']) {
		if (typeof update == 'string') update = { type: update };
		for (const key in update) {
			switch (key) {
				case 'type':
					switch (update.type) {
						case START:
							this.node.play();
							break;
						case PAUSE:
						case STOP:
							this.node.pause();
							break;
					}

					break;
				case 'volume':
					this.node.volume = update.volume;
					break;
				default:
					break;
			}
		}
	}
}
