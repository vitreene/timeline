import { Channel } from './channel';
import { CbStatus, Status, TIME_INTERVAL } from './clock';
import { ChannelName, Eventime } from './types';

/**
 * @param events Events
 * @param store object
 */

type EventChannel = Map<number, Set<string>>;
type EventData = Map<number, Map<number, any>>;
type CasualEvent = Map<string, Eventime>;

const { MAIN, STRAP } = ChannelName;

export class Timeline {
	defaultChannelName = ChannelName.DEFAULT;
	events = new Map<string, EventChannel>();
	channels = new Map();
	times: number[] = [];
	data = new Map<string, EventData>();
	casualEvents = new Map<number, CasualEvent>();

	addChannel(channel: Channel) {
		channel.addEvent = this.addEvent;
		channel.next = this.next;
		channel.init();
		this.channels.set(channel.name, channel);
		this.events.set(channel.name, new Map());
	}

	addEvent = (event: Eventime) => {
		event.name !== 'counter' && console.log('addEvent', event.name);

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

	next = (event: Eventime, name) => {
		const time = event.startAt;
		if (!this.casualEvents.has(time)) this.casualEvents.set(time, new Map());
		const casual = this.casualEvents.get(time);
		casual.set(name, event);
	};

	runNext = (status) => {
		const { currentTime } = status;
		if (this.casualEvents.has(currentTime)) {
			const casual = this.casualEvents.get(currentTime);
			casual.forEach((event, name) => {
				this.channels.get(event.channel).run({ name, time: currentTime, status, data: event.data });
				casual.delete(name);
			});
		}
	};

	run = (status: CbStatus) => {
		if (status.action === 'seek') return this.seek(status);
		/* 
			recoit un time
			- cherche dans les events les correspondances
			- dispatche les events selon le channel
			- recherche du time jusqu'au pointeur suivant : time = 500, chercher 501, 502,..510..599
			- indexer les times + un pointeur 
		*/

		// console.log(status.currentTime);

		const ti = timeIndexes(this.times, status.currentTime);
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
			console.log(this.casualEvents);
		}
	};

	seek = (status: CbStatus) => {
		const pastTimes: number[] = [];
		for (const time of this.times) {
			if (time > status.currentTime) break;
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
	const timeIndexes = [];
	let i = times.findIndex((t) => t === currentTime);
	if (i > 0)
		while (times[i] < currentTime + TIME_INTERVAL) {
			times[i] && timeIndexes.push(times[i]);
			i++;
		}
	return timeIndexes;
}
