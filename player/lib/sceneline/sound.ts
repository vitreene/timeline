import { START, STOP, PLAY, PAUSE, SEEK } from '~/common/constants';
import { PersoAction, PersoSoundDef, SoundAction } from '~/main';
const TIME_THRESHOLD = 10;
interface AudioStatus {
	action: typeof PLAY | typeof PAUSE | typeof SEEK;
	elapsed: number;
}
export class Sound {
	store = new Map<string, PersoSoundDef>();
	status = new Map<string, AudioStatus>();
	constructor() {
		this.sync = this.sync.bind(this);
	}
	update(id: string, { action }: SoundAction) {
		console.log('SOUND', id, action);
		const audio = this.store.get(id).media;
		switch (action) {
			case START:
				if (audio.mediaElement.paused) {
					audio.my.connect();
					this.status.set(id, { action: PLAY, elapsed: 0 });
				}
				break;
			case STOP:
				audio.mediaElement.pause();
				audio.my.disconnect();
				this.status.delete(id);

				break;

			default:
				break;
		}
	}

	sync(delta: number) {
		this.status.forEach(({ action, elapsed }, id) => {
			const audio = this.store.get(id).media;
			if (action === PLAY && audio.mediaElement.paused) {
				audio.mediaElement.play();
			} else {
				elapsed += delta;
				const diff = audio.mediaElement.currentTime * 1000 - elapsed;
				if (diff > TIME_THRESHOLD) {
					audio.mediaElement.currentTime = elapsed / 1000;
					console.log('TIME_THRESHOLD', diff);
				}
				this.status.set(id, { action, elapsed });
			}
		});
	}
}

/* 
store stocke les sons,
update prend les events entrants :
- start
- stop
- pause ?
- seek
- options : 
  - fade
  - volume

tick pour suivre les décalages de tempo

:{action:"start"|"stop"})
*/
