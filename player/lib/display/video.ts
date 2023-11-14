import { START, STOP } from '~/common/constants';
import { PersoVideoDef, VidAction } from '~/main';

// Dans cette version, pas possible de modifier la source video
// complexité inutle en l'état; il n'y a pas besoin de classe pour ceci ?
export class Video {
	node = null;

	constructor(perso: PersoVideoDef) {
		this.node = perso.media;
	}

	update(update: Partial<VidAction>) {
		// console.log(update);
		for (const key in update) {
			switch (key) {
				case 'action':
					switch (update.action) {
						case START:
							this.node.play();
							break;
						case STOP:
							this.node.pause();
							break;

						default:
							break;
					}

					break;

				default:
					break;
			}
		}
	}
}
