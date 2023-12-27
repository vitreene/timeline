import { START, STOP } from '~/common/constants';
import { ROOT, Controller, MapEvent, PersoType as P, PersoVideoDef, PersoSoundDef, Store } from '~/main';
import { preload } from '~/preload';
import { createTelco } from './telco';

const END_SEQUENCE = 7000;
////////////
// DEMO 5 //
////////////

/* NOTE
les formats de données sont issues du json  ; transformer les objets en map dans controller, pas dans le format de données -> meilleure portabilité 
*/
let controller;
// INIT
const events: MapEvent = new Map([
	[0, { name: 'enter' }],
	[1000, { name: 'start_sound_fr' }],
	[1100, { name: 'action01' }],
	[1500, { name: 'action02' }],
	[3000, { name: 'action03', data: { style: { 'font-size': 100, 'background-color': 'cyan' } } }],
	[3200, { name: 'action04' }],
	[4000, { name: 'action05' }],
	[6500, { name: 'end_music_fr' }],
]);

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
		action01: {
			transition: {
				from: { backgroundColor: 'lch(52.2% 72.2 50 / 0.5)' },
				to: { backgroundColor: 'lch(56% 63.61 262.73 / 1)' },
				duration: 1500,
			},
		},
	},
} as const;
const sound01: PersoSoundDef = {
	type: P.SOUND,
	initial: { src: '/1_7b_e.mp3' },
	actions: {
		start_sound_fr: {
			broadcast: {
				type: START,
			},
		},
		end_sound_fr: {
			broadcast: {
				type: STOP,
			},
		},
	},
} as const;

const music01: PersoSoundDef = {
	type: P.SOUND,
	initial: { src: '/music02.m4a' },
	actions: {
		enter: {
			broadcast: {
				type: START,
				transition: {
					to: { volume: 0.2 },
					duration: 1000,
				},
			},
		},
		action02: {
			broadcast: {
				transition: {
					to: { volume: 1 },
					duration: 1000,
				},
			},
		},
		end_music_fr: {
			broadcast: {
				type: STOP,
			},
			// func n'est pas atteignable, cependant des actions en fin d'ecoute sont à intégrer
			// onComplete
			// func() {
			// 	console.log('FINI');
			// },
		},
	},
} as const;

const video01: PersoVideoDef = {
	type: P.VIDEO,
	initial: { src: '/decollage.mp4', style: { opacity: 0.25, x: 0, scale: 1 } },
	actions: {
		action02: {
			move: { to: ROOT, order: 10 },
			broadcast: {
				type: START,
				transition: {
					from: { volume: 0.2 },
					to: { volume: 1 },
					duration: 1000,
				},
			},
			style: {
				'grid-area': '15 / 35 / 70/ 110',
				width: '100%',
				height: '100%',
				'object-fit': 'cover',
				order: 10,
			},
			transition: {
				to: { opacity: 1 },
				duration: 1500,
			},
		},
		action05: {
			// broadcast: STOP,
			// transition: {
			// 	to: { x: 0, y: 100, opacity: 0, scale: 0.1 },
			// 	duration: 1500,
			// },
		},
	},
} as const;

const counter = {
	type: P.TEXT,
	initial: {
		className: 'initial item2',
		content: 'start',
		style: {
			backgroundColor: 'orangered',
			padding: 8,
			'font-size': 36,
			'text-align': 'center',
		},
	},
	actions: {
		enter: {
			move: ROOT,
			className: 'enter',

			strap: {
				type: 'counter',
				initial: {
					duration: 1500,
					start: 0,
					end: 50,
				},
			},
		},
		action01: {
			className: 'action01',
		},
		action02: {
			className: {
				add: 'item4',
				remove: 'item2',
			},
			move: true,
			style: { 'font-weight': 'bold' },
			strap: {
				type: 'counter',
				initial: {
					duration: 2500,
					start: 50,
					end: 0,
				},
			},
			transition: {
				to: { 'font-size': 120 },
				duration: 1500,
			},
		},
		action03: {
			style: {
				color: 'blue',
			},
		},
	},
} as const;

const text3 = {
	type: P.TEXT,
	initial: {
		// move: { to: ROOT, order: 'last' },
		content: 'Lancement',
		className: 'text3 item5',
		style: {
			'user-select': 'none',
			padding: 16,
			'font-size': 24,
			x: 300,
			order: 20,
		},
	},
	actions: {
		enter: {
			move: { to: ROOT, order: 'last' },
		},
		action02: {
			className: {
				add: 'item6',
				remove: 'item5',
			},
			move: true,
		},
	},
	emit: {
		click: {
			event: { name: 'click01' },
			data: {
				id: 'telco',
				func() {
					console.log('****STOP*****');
					controller.stop();
				},
				strap: {
					type: 'toggle',
					initial: {
						valueA: 'on',
						valueB: 'off',
					},
				},
			},
		},
	},
} as const;

const img1 = {
	type: P.IMG,
	initial: {
		className: 'item1',
		style: {
			'background-color': 'oklch(0.42 0.19 328.37 / 1)',
			'object-position': '0% 67%',
			'object-fit': 'cover',
		},
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
		// action01: {
		// 	className: 'action01-img1',
		// },
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

const store: Store = {
	[ROOT]: root,
	// sound01,
	music01,
	video01,
	img1,
	counter,
	text3,
} as const;

// PROCESS
preload(store).then((store) => {
	console.log('LOAD STORE', store);

	controller = new Controller(store, events);
	const duration = END_SEQUENCE;
	controller.start().play();
	// controller.start();

	createTelco(controller, duration);
	// PLAY

	// controller.start().play().wait(1900);
	// controller.start().seek(2500);
	// controller.start().seek(2200).play();
	// controller.start().play();

	// setTimeout(() => {
	// 	console.log('stout PLAY');
	// 	controller.seek(1500).play();
	// }, 1000);

	// setTimeout(() => {
	// 	controller.stop();
	// }, 1200);

	// setTimeout(() => {
	// 	console.log('timeout');
	// 	controller.stop();
	// 	console.log(controller);
	// }, END_SEQUENCE);
});

/* TODOÒ
- wait
- types 
- queue
- render

multi components
tween
tests events, actions

*/

/* FIXME
- avec transform : matrix, le x/y est dépendant de l'échelle !! 
 - etablir et garantir l'ordre des éléments dans layer
 */
