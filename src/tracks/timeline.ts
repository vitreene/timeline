import { timeInInterval, TrackManager } from '.';

import { createStore } from '../render/create-store';
import { channelManager } from '../channels';
import { PersoChannel } from '../channels/channel-perso';
import { StrapChannel } from '../channels/channel-strap';

import { BACKWARD, END_SEQUENCE, SEEK, TIME_INTERVAL } from '../common/constants';

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
		this.seek_ = this.seek_.bind(this);
		this.executeEvent = this.executeEvent.bind(this);

		this.tracks = new TrackManager(tracks, options);
		const next = this.tracks.setNext.bind(this.tracks);
		const addEvent = this.tracks.addEvent.bind(this.tracks);

		const store = createStore(persos, addEvent);
		this.channels = channelManager({ store, addEvent, next, executeEvent: this.executeEvent });
		this.tracks.runs.add(this.run);
		this.tracks.runs.add(this.runNext);
	}

	executeEvent = (name: string, event: Eventime, status: CbStatus) => {
		// console.log('executeEvent', name, event, { ...status });

		if (status.currentTime < status.seekTime) {
			const time = status.currentTime + TIME_INTERVAL;
			const currentStatus: CbStatus = { ...status, currentTime: time, nextTime: time + TIME_INTERVAL };
			this.channels.get(event.channel).run({ name: event.name, time, status: currentStatus, data: event.data });
		} else {
			this.tracks.setNext(name, { ...event, startAt: status.seekTime + TIME_INTERVAL });
		}
	};

	runNext = (status: CbStatus) => {
		const casuals = this.tracks.getNext(status);
		casuals.forEach(({ channel, ...casual }) => {
			// console.log('runNext CASUALS', status.trackName, { ...status });
			this.channels.get(channel).run(casual);
		});
	};

	private seek_(status: CbStatus) {
		const [pastEvents, forwardEvents] = this.tracks.getSeekEvents(status);
		if (forwardEvents) {
			for (const channelName in forwardEvents) {
				this.channels.get(channelName as ChannelName).run(forwardEvents[channelName]);
				this.runNext(status);
				status.seekAction = BACKWARD;
			}
		}
		for (const channelName in pastEvents) {
			this.channels.get(channelName as ChannelName).run(pastEvents[channelName]);
		}
	}

	run(status: CbStatus) {
		if (status.action === SEEK) return this.seek_(status);

		console.log('RUN', status.trackName);

		const controlName = this.tracks.controlName;
		const times = this.tracks.times.get(controlName);
		const ti = timeInInterval(times, status.currentTime);

		ti.forEach((time) => {
			const runs = this.tracks.getEvents(time, status);
			for (const channel in runs) {
				this.channels.has(channel as ChannelName) &&
					runs[channel].forEach((run: RunEvent) => {
						this.channels.get(channel as ChannelName).run(run);
					});
			}
		});

		if (status.endClock) this.endClock(status);
	}

	private endClock(status: CbStatus) {
		this.channels.forEach((channel) => channel.run({ name: 'end-clock', time: status.currentTime, status }));
		console.log('//////////END CLOCK/////////////');
		console.log('END', status.currentTime);
		console.log(this.tracks);
		const current = Array.from(this.tracks.current.values());
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
