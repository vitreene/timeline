import { Channel } from './channel';
import { QueueActions } from '../queue';
import { createRender } from '../render/render-DOM';
import { channelList, Clock } from '../tracks/timeline';

import type { PersoStore } from '../render/create-perso';
import type { AddEvent, ChannelsMap } from '../tracks/timeline';

export function channelManager(store: PersoStore, handler: AddEvent) {
	const channels: ChannelsMap = new Map();

	const render = createRender(store);
	const queue = new QueueActions(render);
	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, timer: Clock });
		channel.addStore(store);
		addChannel(channel);
	});

	function addChannel(channel: Channel) {
		channel.addEvent = handler;
		// channel.executeEvent = this.executeEvent.bind(this);
		// channel.next = this.next;
		channel.init();
		channels.set(channel.name, channel);
	}
	return channels;
}
