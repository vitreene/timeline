import { Controller } from './controller';

import { PersosTypes } from './types';

import type { MapEvent, Store, TimeOptions } from './types';

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
	[3000, { name: 'action03', data: { style: { 'font-size': '200px', color: 'cyan' } } }],
]);

const store: Store = {
	[ROOT]: {
		type: PersosTypes.TEXT,
		initial: {
			className: 'initial',
			content: 'ReToTO',
			style: { top: 0, left: 0, backgroundColor: 'orangered', position: 'absolute', padding: '1rem' },
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
					from: { 'font-size': 16, x: 0, y: 0 },
					to: { 'font-size': 120, x: 300, y: 200 },
					duration: 1500,
				},
			},

			action03: {
				className: 'action03',
				style: {
					backgroundColor: 'blue',
				},
				// action: controller.stop,
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
// la priorité sur le seek n'est aps la meme que pour le play
controller.start().play();
// controller.start().seek(1500).play();

// setTimeout(() => {
// 	console.log('stout PLAY');
// 	controller.seek(1500).play();
// }, 1000);

// setTimeout(() => {
// 	console.log('PAUSE');
// 	console.log('timeElapsed', controller.timeElapsed);
// 	console.log('timePause', controller.timePause);
// 	controller.pause();
// }, 1000);

// setTimeout(() => {
// 	console.log('PLAY');
// 	console.log('timeElapsed', controller.timeElapsed);
// 	console.log('timePause', controller.timePause);
// 	controller.play();
// }, 2000);

setTimeout(() => {
	console.log('timeout');

	controller.stop();
	console.log(controller);
}, 5000);

/* TODO
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
