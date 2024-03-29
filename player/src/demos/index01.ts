import { ROOT } from '../../../../player/src/sceneline/constants';
import { Controller } from '../../../../player/src/sceneline/controller';

import { PersosTypes as P } from '../../../../player/src/sceneline/types';

import type { MapEvent, PersoStore, TimeOptions } from '../../../../player/src/sceneline/types';

////////////
// DEMO 4 //
////////////

// INIT
const events: MapEvent = new Map([
	[0, { name: 'enter' }],
	[700, { name: 'action01' }],
	[1500, { name: 'action02' }],
	[3000, { name: 'action03', data: { style: { 'font-size': 260, 'background-color': 'cyan' } } }],
]);

const store: PersoStore = {
	[ROOT]: {
		type: P.LAYER,
		initial: {
			tag: 'div',
			className: 'root',
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
			className: 'initial',
			// content: 'start',
			style: {
				backgroundColor: 'orangered',
				position: 'absolute',
				padding: 8,
				'font-size': 16,
				height: 50,
				x: 0,
				y: 0,
				rotate: 0,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},
		},
		actions: {
			enter: {
				move: ROOT,
				className: 'enter',
				strap: {
					type: 'counter',
					initial: {
						duration: 2000,
						start: 0,
						end: 50,
					},
				},
			},
			action01: {
				className: {
					add: ['action01', 'action12'],
				},
			},
			action02: {
				style: { 'font-weight': 'bold', top: 0 },
				className: {
					add: 'action2',
					toggle: 'action01',
					remove: 'action12',
				},
				transition: {
					// from: { 'font-size': 16, x: 0, y: 0, rotate: 0 },
					to: { 'font-size': 120, x: 300, y: 200, rotate: 45 },
					duration: 1500,
				},
				strap: {
					type: 'counter',
					initial: {
						duration: 2500,
						start: 50,
						end: 0,
					},
				},
			},
			action03: {
				className: 'action03',
				style: {
					color: 'blue',
				},
				// action: controller.stop,
			},
		},
	},
	text2: {
		type: P.TEXT,
		initial: {
			// content: '2e texte',
			style: {
				'background-color': 'purple',
				'text-align': 'center',
				padding: 10,
				color: 'yellow',
				position: 'absolute',
				x: 0,
				y: 0,
				width: 400,
				height: 100,
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				'font-size': 48,
			},
		},
		actions: {
			action01: {
				style: { 'font-size': 48, 'transform-origin': 'left top' },
				className: 'action01-text2',
				move: { to: ROOT, order: 'first' },
			},
			action02: {
				transition: {
					from: { y: 0, rotate: 0, scale: 1 },
					to: { y: 200, rotate: 360, scale: 1.8 },
					duration: 1400,
				},
			},
		},
	},
};

const transformer01 = ({ options: { time } }: TimeOptions) => {
	// div.textContent = String(time);
};

// PROCESS
const controller = new Controller(store, events);
controller.addToTimer(transformer01);

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
