import { CbStatus } from '../clock';
import type { RunEvent } from './channel';
import { ChannelName } from '../../player/src/types';

import { PAUSE, PLAY, SEEK, SEEKING, TRACK_ENGLISH } from '../../player/src/common/constants';

import type { Eventime, SoundNode, SoundStore } from '../../player/src/types';

const MS = 1000;
const TIME_THRESHOLD = 0.1;

export interface SoundChannelOptions {
	addEvent: (event_: Eventime) => void;
}
type SoundNodeId = SoundNode & { id: string; startTime?: number; status?: string };

export class SoundChannel {
	name = ChannelName.SOUND;
	store = new Map<string, SoundNodeId[]>();
	addEvent: (event: Eventime) => void;
	next: (name: string, event: Eventime) => void;

	constructor(options: SoundChannelOptions) {
		this.onTick = this.onTick.bind(this);
		this.addEvent = options.addEvent;
	}

	setStore(audios: SoundStore) {
		this.store = new Map<string, SoundNodeId[]>();
		Object.entries(audios).forEach(([id, audio]) => {
			const track = audio.initial.track;
			if (!this.store.has(track)) this.store.set(track, []);
			this.store.get(track).push({ id, startTime: 0, ...audio });
		});
		// console.log('SoundChannel', this.store);
	}

	run({ name, time, status, data }: RunEvent): void {
		console.log({ name, time, status, data });

		if (status.statement === SEEK) {
			// console.log('sound SEEK', time, status.seekTime);
			// this.onTick({ ...status, toto: true, statement: PLAY, currentTime: status.seekTime });
			// return;
		}
		// if (status.statement === SEEK) {
		// 	console.log('sound RUNSEEK', time, time === status.currentTime);
		// 	this.runSeek({ name, time, status, data });
		// 	return;
		// }

		// console.log('SoundChannel', status.statement, { name, time, status, data });
		// console.log('SoundChannel', this.store);

		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => {
				const action = audio.actions[name];
				if (action && typeof action !== 'boolean') {
					switch (action.action) {
						case 'start':
							if (audio.media.mediaElement.paused) {
								console.log('SoundChannel start', status.trackName);

								audio.media.my.connect();
								// audio.startTime = status.currentTime;
								audio.startTime = time;
								audio.status = PLAY;
							}
							break;
						case 'end':
							if (!audio.media.mediaElement.paused) {
								audio.media.my.disconnect();
								audio.status = PAUSE;
								audio.media.mediaElement.currentTime = 0;
							}
							break;
						default:
							break;
					}
				}
			});
	}

	/* 	runSeek({ status }: RunEvent) {
		console.log('sound run SEEK', { ...status });

		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => {
				// audio.media.mediaElement.pause();
				this.catchTime(audio, { ...status, currentTime: status.seekTime });
				// audio.media.mediaElement.play();
			});
	}
 */
	onTick(status: CbStatus) {
		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => {
				switch (status.statement) {
					case SEEKING:
						console.log('+++ sound SEEKing', { ...status });
						console.log(audio.status, audio.media.mediaElement.paused);
						this.catchTime(audio, { ...status, currentTime: status.seekTime });
						// Comment empecher le "rattrappage" par le tick avecun currentime à 0 ?
						break;

					case PLAY:
						if (audio.status === PLAY && audio.media.mediaElement.paused) {
							console.log(
								'****sound',
								PLAY,
								status.trackName,
								audio.media.mediaElement.currentTime,
								status.currentTime
							);
							console.log({ ...status });

							audio.media.my.connect();
							audio.media.mediaElement.play();
						}
						if (!audio.media.mediaElement.paused) {
							this.catchTime(audio, status);
						}
						break;
					case PAUSE:
						if (!audio.media.mediaElement.paused) {
							console.log('****sound', PAUSE, status.trackName, audio.media.mediaElement.currentTime);

							audio.media.mediaElement.pause();
							audio.media.my.disconnect();
						}
						break;

					default:
						break;
				}

				// if (!audio.media.mediaElement.paused) {
				// 	this.catchTime(audio, status);
				// }
			});
	}
	runNext(props: RunEvent): void {
		this.run(props);
	}

	catchTime(audio: SoundNodeId, status: CbStatus) {
		// console.log('catchTime', status.trackName, status.currentTime);

		const currentTime = (status.currentTime - audio.startTime) / MS;

		if (currentTime > audio.media.mediaElement.duration) {
			console.log('---->ENDED', audio.id);
			audio.status = PAUSE;
			audio.media.mediaElement.pause();
			audio.media.mediaElement.currentTime = 0;
			return;
		}

		const diff = Math.abs(currentTime - audio.media.mediaElement.currentTime) > TIME_THRESHOLD;
		// console.log(diff, status.trackName, status.currentTime);

		if (diff) {
			console.log(
				'RATRAPAGE-->',
				audio.id,
				status.currentTime,
				audio.startTime,
				currentTime
				// currentTime - audio.media.mediaElement.currentTime
			);
			// RATRAPAGE--> sound_fr 2850 2850 0
			/* {
				"elapsed": 2850,
				"pauseTime": 4868,
				"headTime": 2850,
				"currentTime": 2850,
				"statement": "seeking",
				"timers": {
						"milliemes": 2850,
						"centiemes": 280,
						"diziemes": 28,
						"seconds": 2
				},
				"paused": 0,
				"delta": 0.008,
				"duration": 18000,
				"trackName": "trackPlay",
				"seekTime": 2850
		} */
			console.log({ ...status });

			audio.media.mediaElement.currentTime = currentTime;
		}
	}
}
