import type { SceneComp } from '$lib/server/db';
import type { MapEvent } from '@vitreene/player';
import { Controller } from '@vitreene/player';

export function buildPlay(scene: SceneComp) {
	const events: MapEvent = new Map();

	const mediasEvents = new Map(scene.medias.flatMap((m) => m.events).map((e) => [e.id, e]));

	const sceneEvents = new Map();
	for (const capsule of scene.capsules) {
		for (const element of capsule.elements) {
			// il va y avoir des duplis : non
			element.events.forEach((e) => sceneEvents.set(e.action, e.name));
		}
	}

	const actionsByMedia = {};
}

//TODO
/* 
	construire la liste des actions avec l'indicateur de temps
	e.name = ref TimeEvent -> start
	e.action -> name
	Map([3000, { name: 'action03', data: {} }])
	
	*/
/* 
	pour chaque media dans chaque capsule :
	- identitfier le textime de chaque action;
	faire un tableau  [TextTime[e.name].start : { name: e.action } ] // [ ]
	
	*/
