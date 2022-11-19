import { CbStatus } from '../clock';
import type { RunEvent } from './channel';
import { ChannelName } from '../types';

import { PAUSE, PLAY, SEEK } from '../common/constants';

import type { Eventime, SoundNode, SoundStore } from '../types';

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
		console.log('SoundChannel', this.store);
	}

	run({ name, time, status, data }: RunEvent): void {
		if (status.statement === SEEK) {
			console.log('RUNSEEK', time, time === status.currentTime);
			this.runSeek({ name, time, status, data });
			return;
		}

		console.log('SoundChannel', status.statement, { name, time, status, data });

		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => {
				const action = audio.actions[name];
				if (action && typeof action !== 'boolean') {
					switch (action.action) {
						case 'start':
							if (audio.media.mediaElement.paused) {
								audio.media.mediaElement.play();
								audio.startTime = status.currentTime;
								audio.status = PLAY;
							}
							break;
						case 'end':
							if (!audio.media.mediaElement.paused) {
								audio.media.mediaElement.pause();
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

	runSeek({ status }: RunEvent) {
		console.log('SEEK', status.currentTime);

		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => this.catchTime(audio, status));
	}

	onTick(status: CbStatus) {
		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => {
				switch (status.statement) {
					case PLAY:
						if (audio.status === PLAY && audio.media.mediaElement.paused) {
							console.log('sound', PLAY, audio.media.mediaElement.currentTime);
							audio.media.mediaElement.play();
						}
						break;
					case PAUSE:
						if (!audio.media.mediaElement.paused) {
							console.log('sound', PAUSE, audio.media.mediaElement.currentTime);
							audio.media.mediaElement.pause();
						}
						break;

					default:
						break;
				}

				if (!audio.media.mediaElement.paused) {
					this.catchTime(audio, status);
				}
			});
	}
	runNext(props: RunEvent): void {
		this.run(props);
	}

	catchTime(audio: SoundNodeId, status: CbStatus) {
		const currentTime = (status.currentTime - audio.startTime) / MS;

		if (currentTime > audio.media.mediaElement.duration) {
			console.log('---->ENDED', audio.id);
			audio.status = PAUSE;
			audio.media.mediaElement.pause();
			audio.media.mediaElement.currentTime = 0;
			return;
		}

		const diff = Math.abs(currentTime - audio.media.mediaElement.currentTime) > TIME_THRESHOLD;
		if (diff) {
			console.log(
				'RATRAPAGE-->',
				audio.id,
				status.currentTime,
				audio.startTime,
				currentTime
				// currentTime - audio.media.mediaElement.currentTime
			);

			audio.media.mediaElement.currentTime = currentTime;
		}
	}
}
