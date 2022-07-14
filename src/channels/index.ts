import { Channel } from './channel';
import { QueueActions } from '../queue';
import { Clock } from '../tracks';
import { channelList } from '../tracks/timeline';
import { createRender } from '../render/render-DOM';

import type { Eventime } from '../types';
import type { AddEvent } from '../tracks';
import type { ChannelsMap } from '../tracks/timeline';
import type { PersoStore } from '../render/create-perso';

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
		// FIXME retirer timer des channels
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
