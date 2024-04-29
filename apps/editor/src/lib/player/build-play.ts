import { PersoType as P } from '@vitreene/sceneline';
import type { ElementComp, SceneComp, TextTime } from '$lib/server/db';
import type { ImgAction, MapEvent, PersoImgDef, Store } from '@vitreene/sceneline';
import type { Event as MediaEvent } from '@prisma/client';

const defaultPathImage = '';
const ROOT = 'root';
const LIST = 'list';

export type BuildPlayType = ReturnType<typeof buildPlay>;

export function buildPlay(scene: SceneComp) {
	const events: MapEvent = new Map();

	const mediasEvents = new Map(scene.medias.flatMap((m) => m.events).map((e) => [e.id, e]));

	const sceneEvents: MapEvent = new Map();
	const persos = {} as Store;

	for (const capsule of scene.capsules) {
		for (const element of capsule.elements) {
			const prefix = `${element.capsuleId}_${element.id}`;
			element.events.forEach((e) => {
				const [start, action] = createEvent(e, prefix, mediasEvents);
				if (start != undefined && action != undefined) {
					if (sceneEvents.has(start)) {
						const actions = sceneEvents.get(start);
						if (actions != undefined) {
							if (Array.isArray(actions)) actions.push(action);
							else sceneEvents.set(start, [actions, action]);
						}
					} else sceneEvents.set(start, action);
				}
				persos[element.id] = createBackgroundImage(element);
				persos[ROOT] = root;
				persos[LIST] = list;
			});
		}
	}

	console.log({ sceneEvents });

	return { events: sceneEvents, persos };
}

function createEvent(
	elementEvent: MediaEvent,
	prefix: string,
	mediasEvents: Map<string, TextTime>
): [number, { name: string }] | [] {
	const mEvent = mediasEvents.get(elementEvent.name);
	return mEvent ? [Math.round(mEvent.start * 10) * 100, { name: `${prefix}_${elementEvent.action}` }] : [];
}

function createBackgroundImage(element: ElementComp): PersoImgDef {
	const actions: Record<string, ImgAction> = {};

	for (const e of element.events) {
		actions[`${element.capsuleId}_${element.id}_${e.action}`] = backgroundImageTransition[e.action];
	}

	return {
		type: P.IMG,
		initial: {
			className: 'background-carousel-item',
			content: { src: `/${element.media.path ?? defaultPathImage}` },
		},
		actions,
	};
}

const backgroundImageTransition: Record<string, ImgAction> = {
	intro: {
		move: { to: LIST },
		transition: {
			from: { x: -400, opacity: 0 },
			to: { x: 0, opacity: 1 },
		},
	},
	outro: {
		transition: {
			from: { x: 0, opacity: 1 },
			to: { x: 400, opacity: 0 },
		},
	},
};

const root = {
	type: P.LAYER,
	initial: {
		tag: 'div',
		className: 'container-grid',
		style: {
			position: 'relative',
			backgroundColor: 'lch(52.2% 72.2 50 / 1)',
		},
	},
	actions: {
		[ROOT]: true,
		'1_1_intro': {
			transition: {
				from: { backgroundColor: 'lch(52.2% 72.2 50 / 0.5)' },
				to: { backgroundColor: 'lch(56% 63.61 262.73 / 1)' },
				duration: 1500,
			},
		},
	},
} as const;

const list = {
	type: P.LAYER,
	initial: {
		tag: 'div',
		className: 'background-carousel',
	},
	actions: {
		'1_1_intro': {
			move: { to: ROOT },
		},
	},
} as const;

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
