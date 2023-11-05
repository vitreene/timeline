import { START, STOP, PLAY, PAUSE, SEEK } from '~/common/constants';
import { PersoAction, PersoSoundDef, SoundAction } from '~/main';
const TIME_THRESHOLD = 10;
const MS = 1000;
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
	update(id: string, { action }: SoundAction, delta = 0) {
		console.log('SOUND', id, action);
		const audio = this.store.get(id).media;
		switch (action) {
			case START:
				if (audio.mediaElement.paused) {
					audio.my.connect();
					this.status.set(id, { action: PLAY, elapsed: delta });
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

	start() {
		this.status.forEach((action, id) => {
			const audio = this.store.get(id).media;
			audio.mediaElement.pause();
			if (audio.mediaElement.paused) {
				audio.my.connect();
				this.status.set(id, { ...action, action: PLAY });
			}
		});
	}
	pause() {
		this.status.forEach((action, id) => {
			const audio = this.store.get(id).media;
			audio.mediaElement.pause();
			this.status.set(id, { ...action, action: PAUSE });
		});
	}

	stop() {
		this.status.forEach((_, id) => {
			const audio = this.store.get(id).media;
			audio.mediaElement.pause();
			audio.my.disconnect();
		});
		this.status.clear();
	}

	sync(delta: number) {
		this.status.forEach(({ action, elapsed }, id) => {
			const audio = this.store.get(id).media;
			if (action === PLAY && audio.mediaElement.paused) {
				audio.mediaElement.currentTime = elapsed / MS;
				audio.mediaElement.play();
			} else {
				elapsed += delta;
				const diff = audio.mediaElement.currentTime * MS - elapsed;
				if (diff > TIME_THRESHOLD) {
					audio.mediaElement.currentTime = elapsed / MS;
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
