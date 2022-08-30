import { Timer } from '../clock';
import { Channel } from './channel';
import { QueueActions } from '../queue';
import { channelList } from '../tracks/timeline';
import { createRender } from '../render/render-DOM';

import type { Eventime } from '../types';
import type { AddEvent } from '../tracks';
import type { ChannelsMap } from '../tracks/timeline';
import type { PersoStore } from '../render/create-perso';

interface ChannelManagerProps {
	store: PersoStore;
	timer: Timer;
	addEvent: AddEvent;
	next: (name: string, event: Eventime) => void;
}
export function channelManager({ store, addEvent, next, timer }: ChannelManagerProps) {
	const channels: ChannelsMap = new Map();
	const render = createRender(store);
	const queue = new QueueActions(render);
	timer.subscribeTick(queue.flush);
	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, addEvent });
		addChannel(channel);
	});

	function addChannel(channel: Channel) {
		channel.setStore(store);
		channel.next = next;
		channel.init();
		channels.set(channel.name, channel);
	}
	return channels;
}
