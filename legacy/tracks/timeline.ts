import { timeInInterval, TrackManager } from '.';
import { channelManager } from '../channels';

import { INITIAL, SEEK } from '../../player/src/common/constants';

import type { CbStatus } from '../clock';
import type { MediasStoreProps } from '../../player/src/preload';
import { ChannelName, Eventime } from '../../player/src/types';
import type { Channel, RunEvent } from '../channels/channel';
import type { SoundChannel } from '../channels/channel-sound';

type TrackName = string;
type EventTracks = Record<TrackName, Eventime>;
export type ChannelsMap = Map<ChannelName, Channel | SoundChannel>;

export interface OptionsTimelineConfig {
	defaultTrackName: TrackName;
}

interface TimelineConfig {
	medias: MediasStoreProps;
	tracks?: EventTracks;
	options?: OptionsTimelineConfig;
}

/// SCENELINE
export class Timeline {
	channels: ChannelsMap;
	tracks: TrackManager;

	constructor(props: TimelineConfig) {
		this.run = this.run.bind(this);
		this.runNext = this.runNext.bind(this);
		this.runSeek = this.runSeek.bind(this);

		this.tracks = new TrackManager(props.tracks, props.options);
		this.tracks.runs.store(this.run);
		this.tracks.runs.store(this.runNext);

		const addEvent = this.tracks.addEvent.bind(this.tracks);
		const { medias } = props;
		const next = this.tracks.setNext.bind(this.tracks);
		const timer = this.tracks.clock;
		this.channels = channelManager({ addEvent, medias, next, timer });
	}

	private runNext(status: CbStatus) {
		const casuals = this.tracks.getNext(status);
		casuals.forEach(({ channel, ...casual }) => {
			this.channels.get(channel).runNext(casual);
		});
	}

	private runSeek(status: CbStatus) {
		this.channels.forEach((channel) =>
			channel.run({
				name: INITIAL,
				time: 0,
				status,
			})
		);
		const pastEvents = this.tracks.getSeekEvents(status);

		for (const channelName in pastEvents) {
			pastEvents[channelName].forEach((runEvent: RunEvent) => {
				this.channels.get(channelName as ChannelName).run(runEvent);
			});
		}
	}

	run(status: CbStatus) {
		if (status.statement === SEEK) return this.runSeek(status);

		// console.log('TM RUN', status.trackName, status.currentTime);

		const times = this.tracks.tracks.get(status.trackName).times;
		const ti = timeInInterval(times, status.currentTime);

		ti.forEach((time) => {
			const runEvents = this.tracks.getEvents(time, status);

			for (const channelName in runEvents) {
				this.channels.has(channelName as ChannelName) &&
					runEvents[channelName].forEach((runEvent: RunEvent) => {
						channelName === ChannelName.SOUND && console.log(time, runEvent);
						this.channels.get(channelName as ChannelName).run(runEvent);
					});
			}
		});

		if (status.endClock) this.endClock(status);
	}

	private endClock(status: CbStatus) {
		this.channels.forEach((channel) => channel.run({ name: 'end-clock', time: status.currentTime, status }));
		console.log('//////////END CLOCK/////////////');
		console.log('END', status.trackName, status.currentTime);
		console.log(this.tracks);
		const current = Array.from(this.tracks.tracks.values());
		console.log(
			'events:',
			current.map(({ events }) => events)
		);
		console.log(
			'data',
			current.map(({ data }) => data)
		);
		// console.log('nextEvent', this.nextEvent);
		console.log('///////////////////////////////');
	}
}
