import { Timer } from '../clock';
import { Channel } from './channel';
import { QueueActions } from '../queue';
import { createRender } from '../render/render-DOM';

import { PersoChannel } from './channel-perso';
import { StrapChannel } from './channel-strap';
import { SoundChannel } from './channel-sound';

import { Eventime, SoundStore } from '../types';
import type { AddEvent } from '../tracks';
import type { ChannelsMap } from '../tracks/timeline';
import type { StorePersos } from '../render/create-perso';

export const channelList = [PersoChannel, StrapChannel, SoundChannel];

interface ChannelManagerProps {
	store: StorePersos;
	audio?: SoundStore;
	timer: Timer;
	addEvent: AddEvent;
	next: (name: string, event: Eventime) => void;
}
export function channelManager({ store, audio, addEvent, next, timer }: ChannelManagerProps) {
	const channels: ChannelsMap = new Map();
	const render = createRender(store);
	const queue = new QueueActions(render);
	timer.subscribeTick(queue.flush);
	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, addEvent });
		if (channel instanceof SoundChannel) {
			channel.setStore(audio);
			channel.next = next;
			timer.subscribeTick(channel.onTick);
		} else {
			addChannel(channel);
		}
		channels.set(channel.name, channel);
	});

	function addChannel(channel: Channel) {
		channel.setStore(store);
		channel.next = next;
		channel.init();
	}

	return channels;
}
