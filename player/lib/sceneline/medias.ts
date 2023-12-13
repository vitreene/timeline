import { Tween } from './tween';
import { PersoType as P } from '~/main';
import { PAUSE, PLAY, SEEK, START, STOP } from '~/common/constants';

import type { Broadcast, Transition, PersoSound, PersoVideo, Income } from '~/main';

const TIME_THRESHOLD = 10;
const MS = 1000;

interface MediaStatus {
	action: typeof PLAY | typeof PAUSE | typeof SEEK;
	elapsed: number;
	initial: number;
}

// TODO add audio == video
// ajouter TRACKS comme enfants de video

export class Media {
	store = new Map<string, PersoSound | PersoVideo>();
	status = new Map<string, MediaStatus>();
	transitions = new Map<string, Tween>();

	constructor() {
		this.sync = this.sync.bind(this);
	}

	private getMedia(id: string) {
		const perso = this.store.get(id);
		const media = perso.type === P.SOUND ? perso.media.mediaElement : perso.media;
		return media;
	}

	update(id: string, broadcast: Partial<Broadcast>, update: Income) {
		const { delta, seek } = update;
		// console.log('update broadcast', update);

		if (typeof broadcast === 'string') broadcast = { type: broadcast };

		switch (broadcast.type) {
			case START:
				this.action.start(id, update);
				break;
			case STOP:
				this.action.stop(id);
				this.status.delete(id);
				break;

			default:
				break;
		}

		broadcast.volume && this.action.volume(id, broadcast.volume);
		broadcast.transition && this.initTransition(id, broadcast.transition);
	}

	start = () => {
		console.log(`broadcast - ${START}`);
		this.status.forEach((action, id) => {
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.SOUND: {
					perso.media.mediaElement.pause();
					if (perso.media.mediaElement.paused) {
						perso.media.my.connect();
						this.status.set(id, { ...action, action: PLAY });
					}
				}
				case P.VIDEO:
					(perso as PersoVideo).media.pause();
					this.status.set(id, { ...action, action: PLAY });
					break;

				default:
					break;
			}
		});
	};

	pause = () => {
		console.log(`broadcast - ${PAUSE}`);
		this.status.forEach((_, id) => {
			const perso = this.store.get(id);
			const media = perso.type === P.SOUND ? perso.media.mediaElement : perso.media;
			media.pause();
		});
	};
	stop = () => {
		console.log(`broadcast - ${STOP}`);
		this.status.forEach((_, id) => {
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.SOUND:
					{
						perso.media.mediaElement.pause();
						perso.media.my.disconnect();
					}
					break;
				case P.VIDEO:
					(perso as PersoVideo).media.pause();
					break;

				default:
					break;
			}
		});
		this.status.clear();
	};

	seek(delta: number) {
		this.status.forEach(({ initial }, id) => {
			const media = this.getMedia(id);
			media.currentTime = (delta - initial) / MS;
		});
	}

	action = {
		start: (id: string, update: Income) => {
			const { delta = 0, time = 0 } = update;
			console.log(`broadcast - ${START}`, id);
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.SOUND: {
					if (perso.media.mediaElement.paused) {
						perso.media.my.connect();
						this.status.set(id, { action: PLAY, elapsed: delta, initial: time });
					}
				}
				case P.VIDEO:
					{
						const media = (perso as PersoVideo).media;
						if (media.paused) {
							media.currentTime = delta / MS;
							if (update.seek) this.status.set(id, { action: PLAY, elapsed: delta, initial: time });
							else
								media.play().then(() => {
									this.status.set(id, { action: PLAY, elapsed: delta, initial: time });
								});
						}
					}
					break;

				default:
					break;
			}
		},

		stop: (id: string) => {
			console.log(`broadcast - ${STOP}`, id);
			const perso = this.store.get(id);
			switch (perso.type) {
				case P.SOUND:
					{
						perso.media.mediaElement.pause();
						perso.media.my.disconnect();
					}
					break;
				case P.VIDEO:
					!(perso as PersoVideo).media.paused && (perso as PersoVideo).media.pause();
					break;

				default:
					break;
			}
			this.status.delete(id);
		},
		volume: (id: string, volume: number) => {
			const media = this.getMedia(id);
			media.volume = volume;
		},
	};

	initTransition(id: string, transition: Transition) {
		const media = this.getMedia(id);
		const from = {};
		for (const key in transition.to) {
			from[key] = (transition && transition.from?.[key]) || media[key];
		}
		this.transitions.set(id, new Tween({ ...transition, from }));
	}

	updateTransitions = (delta: number) => {
		this.transitions.forEach((transition, id) => {
			const update = transition.next(delta);
			const media = this.getMedia(id);
			for (const key in update.value) {
				media[key] = update.value[key];
			}

			if (update.done) {
				this.transitions.delete(id);
				transition.onComplete && transition.onComplete();
			}
		});
	};

	sync(delta: number) {
		this.status.forEach(({ action, elapsed }, id) => {
			const perso = this.store.get(id);
			const status = this.status.get(id);
			switch (perso.type) {
				case P.SOUND:
					{
						if (action === PLAY && perso.media.mediaElement.paused) {
							perso.media.mediaElement.currentTime = elapsed / MS;
							perso.media.mediaElement.play();
						} else {
							elapsed += delta;
							const diff = perso.media.mediaElement.currentTime * MS - elapsed;
							if (diff > TIME_THRESHOLD) {
								perso.media.mediaElement.currentTime = elapsed / MS;
								console.log('TIME_THRESHOLD', diff);
							}
							this.status.set(id, { ...status, action, elapsed });
						}
					}

					break;
				case P.VIDEO: {
					if (action === PLAY && perso.media.paused) {
						perso.media.currentTime = elapsed / MS;
						perso.media.play();
					} else {
						elapsed += delta;
						const diff = perso.media.currentTime * MS - elapsed;
						if (diff > TIME_THRESHOLD) {
							perso.media.currentTime = elapsed / MS;
							console.log('VIDEO TIME_THRESHOLD', diff);
						}
						this.status.set(id, { ...status, action, elapsed });
					}
				}

				default:
					break;
			}

			this.updateTransitions(delta);
		});
	}
}
