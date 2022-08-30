import { timeInInterval, TrackManager } from '.';

import { createStore } from '../render/create-store';
import { channelManager } from '../channels';
import { PersoChannel } from '../channels/channel-perso';
import { StrapChannel } from '../channels/channel-strap';

import { BACKWARD, END_SEQUENCE, FORWARD, SEEK, TIME_INTERVAL } from '../common/constants';

import type { CbStatus } from '../clock';
import type { ChannelName, Eventime, Store } from '../types';
import type { Channel, RunEvent } from '../channels/channel';

type TrackName = string;
type EventTracks = Record<TrackName, Eventime>;
export type ChannelsMap = Map<ChannelName, Channel>;

export const channelList = [PersoChannel, StrapChannel];

export interface Options {
	defaultTrackName: TrackName;
}
interface TimelineConfig {
	persos: Store;
	tracks?: EventTracks;
	options?: Options;
}
/// SCENELINE
export class Timeline {
	channels: ChannelsMap;
	tracks: TrackManager;

	constructor({ persos, tracks, options }: TimelineConfig) {
		this.run = this.run.bind(this);
		this.runNext = this.runNext.bind(this);
		this.runSeek = this.runSeek.bind(this);

		this.tracks = new TrackManager(tracks, options);
		const next = this.tracks.setNext.bind(this.tracks);
		const addEvent = this.tracks.addEvent.bind(this.tracks);

		const store = createStore(persos, addEvent);
		this.channels = channelManager({ store, addEvent, next, timer: this.tracks.clock });
		this.tracks.runs.add(this.run);
		this.tracks.runs.add(this.runNext);
	}

	private runNext(status: CbStatus) {
		const casuals = this.tracks.getNext(status);
		casuals.forEach(({ channel, ...casual }) => {
			this.channels.get(channel).runNext(casual);
		});
	}

	private runSeek(status: CbStatus) {
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
			// console.log(runEvents);

			for (const channelName in runEvents) {
				this.channels.has(channelName as ChannelName) &&
					runEvents[channelName].forEach((runEvent: RunEvent) => {
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
