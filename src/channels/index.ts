import { Channel } from './channel';
import { QueueActions } from '../queue';
import { createRender } from '../render/render-DOM';
import { channelList, Clock } from '../tracks/timeline';

import type { PersoStore } from '../render/create-perso';
import type { ChannelsMap } from '../tracks/timeline';
import type { AddEvent } from '../tracks';
import type { Eventime } from '../types';

interface ChannelManagerProps {
	store: PersoStore;
	addEvent: AddEvent;
	next: (name: string, event: Eventime) => void;
	executeEvent: any;
}
export function channelManager({ store, addEvent, next, executeEvent }: ChannelManagerProps) {
	const channels: ChannelsMap = new Map();
	const render = createRender(store);
	const queue = new QueueActions(render);
	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, timer: Clock });
		addChannel(channel);
	});

	function addChannel(channel: Channel) {
		channel.addStore(store);
		channel.next = next;
		channel.addEvent = addEvent;
		channel.executeEvent = executeEvent;

		channel.init();
		channels.set(channel.name, channel);
	}
	return channels;
}
