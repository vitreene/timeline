import { PersoType as P } from '@vitreene/sceneline';
import type { ElementComp, SceneComp, TextTime } from '$lib/server/db';

import type { ImgAction, MapEvent, PersoImgDef } from '@vitreene/sceneline';
import type { Event as MediaEvent } from '@prisma/client';

const defaultPathImage = '';
const ROOT = 'root';

export function buildPlay(scene: SceneComp) {
	const events: MapEvent = new Map();

	const mediasEvents = new Map(scene.medias.flatMap((m) => m.events).map((e) => [e.id, e]));

	const sceneEvents = new Map();
	const persos = new Map();

	for (const capsule of scene.capsules) {
		for (const element of capsule.elements) {
			const prefix = `${element.capsuleId}_${element.id}`;
			element.events.forEach((e) => {
				const [start, action] = createEvent(e, prefix, mediasEvents);
				if (start != undefined) {
					if (sceneEvents.has(start)) {
						const actions = sceneEvents.get(start);
						Array.isArray(actions) ? actions.push(action) : sceneEvents.set(start, [actions, action]);
					} else sceneEvents.set(start, action);
				}
				persos.set(element.id, createBackgroundImage(element));
			});
		}
	}

	persos.forEach((p, id) => console.log(id, p.initial, p.actions));
	return { events: sceneEvents, persos };
}

function createEvent(elementEvent: MediaEvent, prefix: string, mediasEvents: Map<string, TextTime>) {
	const mEvent = mediasEvents.get(elementEvent.name);
	return mEvent ? [mEvent.start * 1000, { name: `${prefix}_${elementEvent.action}` }] : [];
}

function createBackgroundImage(element: ElementComp): PersoImgDef {
	const actions: Record<string, ImgAction> = {};

	for (const e of element.events) {
		actions[`${element.capsuleId}_${element.id}_${e.action}`] = backgroundImageTransition[e.action];
	}
	return {
		type: P.IMG,
		initial: {
			className: 'background-carousel',
			content: { src: element.media.path ?? defaultPathImage },
		},
		actions,
	};
}

const backgroundImageTransition: Record<string, ImgAction> = {
	intro: {
		transition: {
			from: { x: '-100%', opacity: 0 },
			to: { x: 0, opacity: 1 },
		},
	},
	outro: {
		transition: {
			from: { x: 0, opacity: 1 },
			to: { x: '-100%', opacity: 0 },
		},
	},
};
/* 
const img1 = {
	type: P.IMG,
	initial: {className: 'background-carousel',
		content: { src: '/mandrake.jpg' },
	},
	actions: {
		enter: {
			move: { to: ROOT, order: 11 },
			transition: {
				from: { scale: 0, opacity: 0 },
				to: { scale: 1, opacity: 1 },
				duration: 1000,
			},
			style: { order: 11 },
		},
		action02: {
			transition: {
				to: {
					'object-position': '50% 50%',
					'background-color': 'oklch(0.42 0.19 328.37 / 0)',
				},
				duration: 1000,
			},

			style: {
				'object-fit': 'contain',
			},
			content: { src: '/old-television.webp' },
		},
	},
} as const;
*/

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
	
	dans la mesure ou l'ensemble est reconstruit à chaque modification, il pourrait suffire de renommer les actions ${media.id}_${action.name}
	
	*/
