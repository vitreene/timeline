import { Timer } from '../clock';
import { QueueActions } from '../queue';
import { createRender } from '../render/render-DOM';

import { PersoChannel } from './channel-perso';
import { StrapChannel } from './channel-strap';
import { SoundChannel } from './channel-sound';
import { ThreeChannel } from './channel-three';

import { Eventime, SoundStore } from '../types';
import type { AddEvent } from '../tracks';
import type { ChannelsMap } from '../tracks/timeline';
import type { StorePersos } from '../render/create-perso';

export const channelList = [PersoChannel, StrapChannel, SoundChannel, ThreeChannel];

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
		channel.next = next;

		if (channel instanceof SoundChannel) {
			channel.setStore(audio);
			timer.subscribeTick(channel.onTick);
		} else if (channel instanceof ThreeChannel) {
			timer.subscribeTick(channel.onTick);
		} else {
			channel.setStore(store);
		}
		channels.set(channel.name, channel);
	});

	return channels;
}
