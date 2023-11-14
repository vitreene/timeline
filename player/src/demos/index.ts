import { START, STOP } from '~/common/constants';
import { ROOT, Controller, MapEvent, PersoType as P, PersoMediaStore, PersoStore } from '~/main';
import { preload } from '~/preload';
import { createTelco } from './telco';

const END_SEQUENCE = 7000;
////////////
// DEMO 5 //
////////////

/* NOTE
les formats de données sont issues du json  ; transformer les objets en map dans controller, pas dans le format de données -> meilleure portabilité 
*/

// INIT
const events: MapEvent = new Map([
	[0, { name: 'enter' }],
	[1000, { name: 'start_sound_fr' }],
	[1100, { name: 'action01' }],
	[1500, { name: 'action02' }],
	[3000, { name: 'action03', data: { style: { 'font-size': 100, 'background-color': 'cyan' } } }],
	[3200, { name: 'action04' }],
	[6500, { name: 'end_music_fr' }],
]);

const sound01 = {
	type: P.SOUND,
	initial: { src: '/1_7b_e.mp3' },
	actions: {
		start_sound_fr: { action: START },
		end_sound_fr: { action: STOP },
	},
} as const;

const music01 = {
	type: P.SOUND,
	initial: { src: '/music02.m4a' },
	actions: {
		enter: {
			action: START,
			transition: {
				// from: { volume: 1 },
				to: { volume: 0.2 },
				duration: 1000,
			},
		},
		action02: {
			transition: {
				// from: { volume: 1 },
				to: { volume: 1 },
				duration: 1000,
			},
		},
		end_music_fr: { action: STOP },
	},
} as const;

const video01 = {
	type: P.VIDEO,
	initial: { src: '/decollage.mp4', style: { opacity: 0, x: 0, scale: 1 } },
	actions: {
		action01: {
			// broadcast:{
			action: START,
			volume: 0.5,
			// },
			move: ROOT,
			transition: {
				to: { opacity: 1, x: 500, scale: 1.5 },
				duration: 1500,
			},
		},
		action04: {
			action: STOP,
			transition: {
				to: { opacity: 0, x: 0, scale: 0.5 },
				duration: 500,
			},
		},
	},
} as const;

const store = {
	sound01,
	music01,
	// video01,
	[ROOT]: {
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
	},
	'text-counter': {
		type: P.TEXT,
		initial: {
			className: 'initial item2',
			content: 'start',
			style: {
				backgroundColor: 'orangered',
				padding: 8,
				'font-size': 36,
				'text-align': 'center',
				// @ts-ignore-line
				// rotate: 0,
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
				className: 'item4',
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
	},
	img1: {
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
				move: { to: ROOT, order: 'first' },
				transition: {
					from: { scale: 0, opacity: 0 },
					to: { scale: 1, opacity: 1 },
					duration: 1000,
				},
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
	},
	text3: {
		type: P.TEXT,
		initial: {
			content: 'automatique',
			className: 'text3 item5',
			style: {
				padding: 16,
				'font-size': 24,
			},
		},
		actions: {
			enter: {
				move: { to: ROOT, order: 'last' },
			},
			action01: {
				content: 'grande ligne semi-magnétique',
			},
			action02: {
				className: {
					add: 'item55',
					remove: 'item5',
				},
				move: true,
			},
		},
	},
} as const;

// PROCESS
preload(store).then((store) => {
	console.log('LOAD STORE', store);

	const controller = new Controller(store, events);
	const duration = END_SEQUENCE;
	// controller.start().play();
	controller.start();
	createTelco(controller, duration);
	// PLAY
	// FIXME la priorité sur le seek n'est aps la meme que pour le play
	// controller.start().play().wait(1900);
	// controller.start().seek(2200);
	// controller.start().seek(2200).play();
	// controller.start().play();

	// setTimeout(() => {
	// 	console.log('stout PLAY');
	// 	controller.seek(1500).play();
	// }, 1000);

	// const pause01 = 1000;
	// setTimeout(() => {
	// 	console.log('-> PAUSE', pause01);
	// 	console.log('timeElapsed', controller.timer.elapsed);
	// 	console.log('time', controller.timer.time);
	// 	controller.pause();
	// }, pause01);

	// const play01 = 2000;
	// setTimeout(() => {
	// 	console.log('-> PLAY', play01);
	// 	console.log('timeElapsed', controller.timer.elapsed);
	// 	console.log('time', controller.timer.time);
	// 	controller.play();
	// }, play01);

	setTimeout(() => {
		console.log('timeout');

		// controller.stop();
		console.log(controller);
	}, END_SEQUENCE);
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
priorité des actions n'est pas la meme en play et en seek
 */
