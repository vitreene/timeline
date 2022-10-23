import { Timer } from '../clock';
import { QueueActions } from '../queue';
import { createRender } from '../render/render-DOM';

import { PersoChannel } from './channel-perso';
import { StrapChannel } from './channel-strap';
import { SoundChannel } from './channel-sound';
import { ThreeChannel } from './channel-three';

import { Eventime, PersoStore, SoundStore } from '../types';
import type { AddEvent } from '../tracks';
import type { ChannelsMap } from '../tracks/timeline';
import type { StorePersos } from '../render/create-perso';
import { OptionalMediasStoreProps } from 'src/preload';

export const channelList = [PersoChannel, StrapChannel, SoundChannel, ThreeChannel];

interface ChannelManagerProps {
	store: StorePersos;
	medias: Partial<OptionalMediasStoreProps>;
	timer: Timer;
	addEvent: AddEvent;
	next: (name: string, event: Eventime) => void;
}
export function channelManager({ store, medias, addEvent, next, timer }: ChannelManagerProps) {
	const channels: ChannelsMap = new Map();
	const render = createRender(store);
	const queue = new QueueActions(render);
	timer.subscribeTick(queue.flush);
	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, addEvent });
		channel.next = next;

		if (channel instanceof SoundChannel) {
			channel.setStore(medias.audio);
			timer.subscribeTick(channel.onTick);
		} else if (channel instanceof ThreeChannel) {
			/* 
			non 
			les éléments de la scene iront dans le composant
			Ce sont les actions qu'il faut garder
			il faut un render Threejs 

			créer un object Scene 
			- id
			- tag = div
			- initial
				- dimensions
			- content :
				- function init : la fonction ou l'url
			- actions : sur la scene ou sur l'objet ? 

			dans init, toute la logique de construction de la scene 
			voir dans le futur si des elements : lumière, camera... peuvent etre decrits dans des persos
			dans store, créer un perso Scene3d
			y mettre la logique
			y attacher les persos 3d
			detacher media des persos, ne sera pas utile 
			*/
			// channel.setStore(medias.thr3d);
			timer.subscribeTick(channel.onTick);
		} else {
			channel.setStore(store);
		}
		channels.set(channel.name, channel);
	});

	return channels;
}
