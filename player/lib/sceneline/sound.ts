import { Tween } from './tween';
import { START, STOP, PLAY, PAUSE, SEEK } from '~/common/constants';

import type { PersoSoundDef, SoundAction, Transition } from '~/main';
// import { Ticker } from './ticker';

const TIME_THRESHOLD = 10;
const MS = 1000;
interface AudioStatus {
	action: typeof PLAY | typeof PAUSE | typeof SEEK;
	elapsed: number;
}
export class Sound {
	store = new Map<string, PersoSoundDef>();
	status = new Map<string, AudioStatus>();
	transitions = new Map<string, Tween>();
	// ticker = Ticker;
	// constructor(ticker) {
	// this.ticker = ticker;

	constructor() {
		this.sync = this.sync.bind(this);
	}
	update(id: string, sa: SoundAction, delta = 0) {
		const audio = this.store.get(id).media;

		switch (sa.action) {
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
		sa.transition && this.initTransition(id, sa.transition);
		sa.volume && (audio.mediaElement.volume = sa.volume);
		sa.playbackRate && (audio.mediaElement.playbackRate = sa.playbackRate);
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
		this.updateTransitions(delta);
	}

	initTransition(id: string, transition: Transition) {
		const audio = this.store.get(id).media;
		const from = {};
		for (const key in transition.to) {
			from[key] = (transition && transition.from?.[key]) || audio.mediaElement[key];
		}
		this.transitions.set(id, new Tween({ ...transition, from }));
	}

	updateTransitions = (delta: number) => {
		this.transitions.forEach((transition, id) => {
			const update = transition.next(delta);
			const audio = this.store.get(id).media;
			for (const key in update.value) {
				audio.mediaElement[key] = update.value[key];
			}
			if (update.done) {
				this.transitions.delete(id);
				transition.onComplete && transition.onComplete();
			}
		});
	};
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

pour un effet de fade, tween doit etre adapté pour accepter une transition sans avaoir besoin d'un Perso, ni que from et to soient de type Style
*/
