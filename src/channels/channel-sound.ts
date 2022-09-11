import { ChannelName, Eventime, SoundNode, SoundStore } from '../types';
import { PAUSE, PLAY, SEEK } from '../common/constants';
import type { RunEvent } from './channel';
import { CbStatus } from '../clock';

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

	setStore(audio: SoundStore) {
		this.store = new Map<string, SoundNodeId[]>();
		Object.entries(audio).forEach(([id, sound]) => {
			const track = sound.initial.track;
			if (!this.store.has(track)) this.store.set(track, []);
			this.store.get(track).push({ id, ...sound });
		});
		console.log('SoundChannel', this.store);
	}

	run({ name, time, status, data }: RunEvent): void {
		console.log('SoundChannel', { name, time, status, data });

		this.store.has(status.trackName) &&
			this.store.get(status.trackName).forEach((audio) => {
				const action = audio.actions[name];
				if (action && typeof action !== 'boolean') {
					switch (action.action) {
						case 'start':
							audio.media.mediaElement.play();
							audio.startTime = status.currentTime;
							audio.status = PLAY;
							break;
						case 'end':
							audio.media.mediaElement.pause();
							audio.status = PAUSE;
							audio.media.mediaElement.currentTime = 0;
							break;
						default:
							break;
					}
				}
			});

		if (status.statement === SEEK) {
			console.log('RUNSEEK', time, time === status.currentTime);

			this.runSeek({ name, time, status, data });
		}
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
						if (audio.status === PLAY) {
							audio.media.mediaElement.play();
						}
						break;
					case PAUSE:
						audio.media.mediaElement.pause();
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
		const currentTime = (status.currentTime - (audio.startTime || 0)) / MS;
		const diff = Math.abs(currentTime - audio.media.mediaElement.currentTime) > TIME_THRESHOLD;
		if (diff) {
			console.log('RATRAPAGE-->', currentTime - audio.media.mediaElement.currentTime);
			audio.media.mediaElement.currentTime = currentTime;
		}
	}
}
