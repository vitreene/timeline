import { Channel } from './channel';
import { CbStatus } from './clock';
import { Eventime } from './types';

import { FORWARD, BACKWARD, TIME_INTERVAL, DEFAULT_CHANNEL_NAME, SEEK } from './common/constants';

/**
 * @param events Events
 * @param store object
 */

type EventChannel = Map<number, Set<string>>;
type EventData = Map<number, Map<number, any>>;
type CasualEvent = [string, Eventime];

export class Timeline {
	defaultChannelName = DEFAULT_CHANNEL_NAME;
	events = new Map<string, EventChannel>();
	channels = new Map();
	times: number[] = [];
	data = new Map<string, EventData>();
	nextEvent = new Map<number, CasualEvent[]>();

	addChannel(channel: Channel) {
		channel.addEvent = this.addEvent;
		channel.executeEvent = this.executeEvent.bind(this);
		channel.next = this.next;
		channel.init();
		this.channels.set(channel.name, channel);
		this.events.set(channel.name, new Map());
	}

	addEvent = (event: Eventime) => {
		this._registerEvent(event);
		// TODO ajouter la valeur start relative
		if (event.events) event.events.map(this.addEvent);
		else {
			// trier, puis ref unique
			this.times.sort((a, b) => a - b);
			const times = new Set(this.times);
			this.times = Array.from(times);
		}
	};
	_registerEvent = (event: Eventime) => {
		const channel = event.channel || this.defaultChannelName;

		if (!this.events.has(channel)) {
			console.warn(`Channel ${channel} has not been declared`);
			return;
		}
		const channelEvent = this.events.get(channel);

		if (channelEvent.has(event.startAt)) {
			const _events = channelEvent.get(event.startAt);
			_events.add(event.name);
			channelEvent.set(event.startAt, _events);
		} else channelEvent.set(event.startAt, new Set<string>([event.name]));
		!this.times.includes(event.startAt) && this.times.push(event.startAt);

		if (event.data) this.addData(event);
	};

	addData = (event: Eventime) => {
		!this.data.has(event.name) && this.data.set(event.name, new Map());
		const eventData = this.data.get(event.name);
		eventData.set(event.startAt, event.data);
	};

	executeEvent = (event: Eventime, name: string, status: CbStatus) => {
		if (status.currentTime < status.seekTime) {
			const time = status.currentTime + TIME_INTERVAL;
			const currentStatus: CbStatus = { ...status, currentTime: time, nextTime: time + TIME_INTERVAL };
			this.channels.get(event.channel).run({ name: event.name, time, status: currentStatus, data: event.data });
		} else {
			this.next({ ...event, startAt: status.seekTime + TIME_INTERVAL }, name);
		}
	};

	next = (event: Eventime, name: string) => {
		const time = event.startAt;
		if (!this.nextEvent.has(time)) this.nextEvent.set(time, []);
		const casual = this.nextEvent.get(time);
		casual.push([name, event]);
	};

	runNext = (status: CbStatus) => {
		if (status.seekAction === BACKWARD) return;

		status.seekAction === FORWARD && (status.currentTime += TIME_INTERVAL);
		const { currentTime } = status;

		if (this.nextEvent.has(currentTime)) {
			const casual = this.nextEvent.get(currentTime);
			casual.forEach(([name, event]) => {
				this.channels.get(event.channel).run({ name, time: currentTime, status, data: event.data });
			});
			this.nextEvent.delete(currentTime);
		}
	};

	run = (status: CbStatus) => {
		if (status.action === SEEK) return this.seek(status);
		/* 
			recoit un time
			- cherche dans les events les correspondances
			- dispatche les events selon le channel
			- recherche du time jusqu'au pointeur suivant : time = 500, chercher 501, 502,..510..599
			- indexer les times + un pointeur 
		*/

		// console.log('RUN', status.currentTime);

		const ti = timeIndexes(this.times, status.currentTime);
		// console.log('RUN timeIndexes', status.currentTime, ti);

		this.channels.forEach(({ name: channel }) => {
			if (!this.events.has(channel)) return;
			const events = this.events.get(channel);
			for (const currentTime of ti) {
				if (events.has(currentTime)) {
					events.get(currentTime).forEach((name) => {
						const data = this.data.has(name) && this.data.get(name).has(currentTime) && this.data.get(name).get(currentTime);
						this.channels.get(channel).run({ name, time: currentTime, status, data });
					});
				}
			}
		});

		if (status.endClock) {
			this.channels.forEach((channel) => channel.run({ time: status.currentTime, status }));
			console.log('END', status.currentTime);
			console.log('events:', this.events);
			// console.log(this.times);
			console.log(this.data);
			console.log(this.nextEvent);
		}
	};

	seek = (status: CbStatus) => {
		status.seekAction = status.currentTime < status.seekTime ? FORWARD : BACKWARD;

		if (status.seekAction === FORWARD) {
			const forwardTimes = [];
			for (const time of this.times) {
				if (time > status.currentTime && time < status.seekTime) forwardTimes.push(time);
			}
			this.channels.forEach(({ name: channelName }) => {
				if (!this.events.has(channelName)) return;
				const events = this.events.get(channelName);
				const channel = this.channels.get(channelName);
				for (const time of forwardTimes) {
					if (events.has(time)) {
						events.get(time).forEach((name) => {
							const data = this.data.has(name) && this.data.get(name).has(time) && this.data.get(name).get(time);
							channel.run({ name, time, status, data });
						});
					}
				}
			});
			this.runNext(status);
			status.seekAction = BACKWARD;
		}

		const pastTimes: number[] = [];
		for (const time of this.times) {
			if (time > status.seekTime) break;
			pastTimes.push(time);
		}

		this.channels.forEach(({ name: channelName }) => {
			if (!this.events.has(channelName)) return;
			const events = this.events.get(channelName);
			const channel = this.channels.get(channelName);

			for (const time of pastTimes) {
				if (events.has(time)) {
					events.get(time).forEach((name) => {
						const data = this.data.has(name) && this.data.get(name).has(time) && this.data.get(name).get(time);
						channel.run({ name, time, status, data });
					});
				}
			}
		});
	};
}

function timeIndexes(times: number[], currentTime: number) {
	const timeIndexes: number[] = [];
	let i = times.findIndex((t) => t === currentTime);

	if (i > -1)
		while (times[i] < currentTime + TIME_INTERVAL) {
			times[i] !== undefined && timeIndexes.push(times[i]);
			i++;
		}
	return timeIndexes;
}
