import { Controller } from './controller';

import { PersosTypes as P } from './types';

import type { MapEvent, Perso, PersoId, TimeOptions } from './types';

// PREP
export const ROOT = 'root';
export const APP = 'app';

////////////
// DEMO 4 //
////////////

// INIT
const events: MapEvent = new Map([
	[0, { name: 'enter' }],
	[700, { name: 'action01' }],
	[1500, { name: 'action02' }],
	[3000, { name: 'action03', data: { style: { 'font-size': 260, backgroundColor: 'cyan' } } }],
]);

const store: Record<PersoId, Perso> = {
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
			action03: true,
		},
	},
	text1: {
		type: P.TEXT,
		initial: {
			className: 'initial',
			content: 'start',
			style: { top: 0, left: 0, backgroundColor: 'orangered', position: 'absolute', padding: '1rem' },
			move: ROOT,
		},
		actions: {
			enter: {
				className: 'enter',
			},
			action01: {
				className: {
					add: ['action01', 'action12'],
				},
				content: 'roots',
			},
			action02: {
				style: { 'font-weight': 'bold', top: 0 },
				className: {
					add: 'action2',
					toggle: 'action01',
					remove: 'action12',
				},
				transition: {
					from: { 'font-size': 16, x: 0, y: 0, rotate: 0 },
					to: { 'font-size': 120, x: 300, y: 200, rotate: 45 },
					duration: 1500,
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
			content: '2e texte',
			style: {
				'background-color': 'purple',
				'text-align': 'center',
				padding: '1rem',
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
				style: { 'font-size': 48 },
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
controller.start().seek(2000).play();
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
