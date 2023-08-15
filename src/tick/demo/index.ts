import { ROOT } from '../constants';
import { Controller } from '../controller';

import { PersosTypes as P } from '../types';

import type { MapEvent, Perso, PersoId, PersoStore, TimeOptions } from '../types';

////////////
// DEMO 5 //
////////////

// INIT
const events: MapEvent = new Map([
	[0, { name: 'enter' }],
	[1100, { name: 'action01' }],
	[1500, { name: 'action02' }],
	[3000, { name: 'action03', data: { style: { 'font-size': 260, 'background-color': 'cyan' } } }],
]);

const store: PersoStore = {
	[ROOT]: {
		type: P.LAYER,
		initial: {
			tag: 'div',
			className: 'container-grid',
			style: {
				position: 'relative',
				backgroundColor: 'yellowgreen',
			},
		},
		actions: {
			[ROOT]: true,
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
				rotate: 0,
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
			/* FIXME
			l'action du strap ne permet pas à action01 de se produire
			*/
			action01: {
				className: 'action01',
				// style: { 'background-color': 'green' },
				// className: {
				// 	add: ['item4', 'action12'],
				// 	remove: ['initial', 'item2'],
				// },
			},
			action02: {
				className: 'item4',
				move: true,
				style: { 'font-weight': 'bold' },
				// strap: {
				// 	type: 'counter',
				// 	initial: {
				// 		duration: 2500,
				// 		start: 50,
				// 		end: 0,
				// 	},
				// },
			},
			/* 		action03: {
				style: {
					color: 'blue',
				},
			}, */
		},
	},
	text2: {
		type: P.TEXT,
		initial: {
			className: 'item1',
			style: {
				'background-color': 'purple',
				'text-align': 'center',
				padding: 10,
				color: 'yellow',
				'font-size': 48,
			},
		},
		actions: {
			action01: {
				className: 'action01-text2',
				move: { to: ROOT, order: 'first' },
			},
			action02: {},
		},
	},
};

// PROCESS
const controller = new Controller(store, events);

// PLAY
// FIXME la priorité sur le seek n'est aps la meme que pour le play
// controller.start().play().wait(1900);
// controller.start().seek(2800);
// controller.start().seek(2000).play();
controller.start().play();

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

	controller.stop();
	console.log(controller);
}, 4000);

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
