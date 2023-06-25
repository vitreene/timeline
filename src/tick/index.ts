import { Controller } from './controller';

import type { MapAction, MapEvent, PersoAction, TimeOptions } from './types';

// PREP

const id = 'my-div';
const app = document.getElementById('app');
export let div = document.createElement('div');
div.id = id;
app.appendChild(div);
initDiv();

// TODO utiliser une vraie fonction
export function initDiv() {
	div.removeAttribute('style');
	div.removeAttribute('className');
	// div.textContent = '';
	div.style.fontSize = '48px';
	div.style.position = 'absolute';
}
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

const actions: MapAction = new Map(
	Object.entries({
		enter: {
			style: { color: 'orange' },
			className: 'enter',
			content: 'ToTO',
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
				from: { 'font-size': 16, x: 0, y: 0 },
				to: { 'font-size': 120, x: 300, y: 200 },
				duration: 1500,
			},
		},

		action03: {
			className: 'action03',
			// action: controller.stop,
		},
	})
);

const persoActions: PersoAction = new Map();
persoActions.set(id, actions);

const transformer01 = ({ options: { time } }: TimeOptions) => {
	div.textContent = String(time);
};

// PROCESS
const controller = new Controller(persoActions, events);
controller.addToTimer(transformer01);

// PLAY
// la priorité sur le seek n'est aps la meme que pour le play
controller
	.start()
	// .seek(3000);
	.play();

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
