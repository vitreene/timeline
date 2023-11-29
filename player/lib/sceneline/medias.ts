import { PAUSE, PLAY, SEEK, START, STOP } from '~/common/constants';
import { Broadcast, PersoSoundDef, PersoVideoDef, PersoType as P, PersoNode } from '~/main';

interface MediaStatus {
	action: typeof PLAY | typeof PAUSE | typeof SEEK;
	elapsed: number;
}
export class Media {
	store = new Map<string, PersoNode>();
	status = new Map<string, MediaStatus>();

	constructor() {}
	update(id: string, broadcast: Partial<Broadcast>, delta: number) {
		switch (typeof broadcast === 'string' ? broadcast : broadcast.type) {
			case START:
				this.action.start(id);
				this.status.set(id, { action: PLAY, elapsed: delta });

				break;
			case STOP:
				this.action.stop(id);
				this.status.delete(id);
				break;

			default:
				break;
		}
	}

	action = {
		start: (id: string) => {
			console.log(`broadcast - ${START}`, id);
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.VIDEO:
					perso.media.play();

					break;

				default:
					break;
			}
		},
		stop: (id: string) => {
			console.log(`broadcast - ${STOP}`, id);
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.VIDEO:
					perso.media.pause();

					break;

				default:
					break;
			}
		},
		volume: (id: string, volume: number) => {
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.VIDEO:
					perso.media.volume = volume;

					break;

				default:
					break;
			}
		},
	};
}
