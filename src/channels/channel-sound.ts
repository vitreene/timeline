import { ChannelName, Eventime, SoundNode, SoundStore } from '../types';
import { PAUSE, PLAY } from '../common/constants';
import type { RunEvent } from './channel';
import { CbStatus } from '../clock';

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
		if (status.statement !== PLAY) return;
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
				const currentTime = (status.currentTime - (audio.startTime || 0)) / 1000;
				if (currentTime - audio.media.mediaElement.currentTime > 0.1) {
					console.log('RATRAPAGE-->', currentTime - audio.media.mediaElement.currentTime);
					audio.media.mediaElement.currentTime = currentTime;
				}
			});
	}
	runNext(props: RunEvent): void {
		this.run(props);
	}
}
