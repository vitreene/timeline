import { Timer } from '../clock';
import { QueueActions } from '../queue';
import { createRender } from '../render/render-DOM';
import { createStore } from '../render/create-store';

import { PersoChannel } from './channel-perso';
import { StrapChannel } from './channel-strap';
import { SoundChannel } from './channel-sound';
import { ThreeChannel } from './channel-three';

import { Eventime, PersoElementType, PersoThr3dSceneItem } from '../types';
import type { AddEvent } from '../tracks';
import type { ChannelsMap } from '../tracks/timeline';
import { MediasStoreProps } from 'src/preload';

export const channelList = [PersoChannel, StrapChannel, SoundChannel, ThreeChannel];

interface ChannelManagerProps {
	medias: MediasStoreProps;
	timer: Timer;
	addEvent: AddEvent;
	next: (name: string, event: Eventime) => void;
}
export function channelManager(props: ChannelManagerProps) {
	const { addEvent, next, timer } = props;
	const { persos, ...medias } = props.medias;
	const store = createStore(persos, addEvent);
	const channels: ChannelsMap = new Map();
	const render = createRender(store);
	const queue = new QueueActions(render);

	timer.subscribeTick(queue.flush);

	channelList.forEach((Channel) => {
		const channel = new Channel({ queue, addEvent });
		channel.next = next;

		if (channel instanceof SoundChannel) {
			if (medias.audio) {
				channel.setStore(medias.audio);
				timer.subscribeTick(channel.onTick);
				channels.set(channel.name, channel);
			}
		} else if (channel instanceof ThreeChannel) {
			const scenes = store.getPersosbyType(PersoElementType.THR3D_SCENE);
			if (scenes) {
				channel.setStore(scenes);
				scenes.forEach((scene: PersoThr3dSceneItem) => {
					scene.initial.content.children.forEach((id) => {
						const channelStore = scene.child.add(id, medias.thr3d[id]);
						channelStore && channel.addCallback(scene.id, channelStore);
					});
				});
				timer.subscribeTick(channel.onTick);
				channels.set(channel.name, channel);
			}
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

			/* 
-> chercher scenes | pour chaque scene :
			- charger les assets : persos, animations et pourquoi pas : ligts, cameras, orbitcontrol...
			les assets ont deux methodes : 
			- onInit : une fonction pour modifier des caractéristiques des assets
			- onUpdate : est ajouté au rendu 
add to scene
*/
		} else {
			channel.setStore(store);
			channels.set(channel.name, channel);
		}
	});

	return channels;
}
