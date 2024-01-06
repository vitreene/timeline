import { START, STOP } from '~/common/constants';
import { ROOT, Controller, MapEvent, PersoType as P, PersoVideoDef, PersoSoundDef, Store } from '~/main';
import { preload } from '~/preload';
import { createTelco } from './telco';

const END_SEQUENCE = 7000;
const LIST = 'list';
////////////
// DEMO List //
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
	[3000, { name: 'action03' /* data: { style: { 'font-size': 100, 'background-color': 'cyan' } } */ }],
	[3500, { name: 'action04' }],
	[4000, { name: 'action05' }],
	[6500, { name: 'end_music_fr' }],
]);

const zoomIn = {
	from: { opacity: 0, scale: 0.1 },
	to: { opacity: 1, scale: 1 },
	duration: 800,
	ease: 'backOut',
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
		action01: {
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
		className: 'container-list',
	},
	actions: {
		enter: {
			move: { to: ROOT },
		},
	},
} as const;

const items = Array.from(Array(5).keys()).map((index) => {
	return {
		type: P.TEXT,
		id: `item_${index}`,
		initial: {
			className: 'list-item',
			content: index,
		},
		actions: {
			enter: { move: { to: LIST }, transition: zoomIn },
		},
	};
});

// @ts-ignore
items[3].actions.action02 = { move: false };
// delete items[3].actions.enter;
// @ts-ignore
// items[3].actions.action03 = {
// 	move: LIST,
// 	transition: zoomIn,
// };
// items[4].actions.action03 = { move: { to: LIST } };
// items[1].actions.action04 = { move: { to: LIST, order: 'middle' } };
// items[4].actions.action02 = { move: { to: ROOT, order: 'last' } };
// items[4].actions.action05 = { move: { to: LIST, order: 'middle' } };
// items[3].actions.action03 = { move: { order: 10 } };
// items[0].actions.action03 = { move: { to: ROOT, order: 'toto' } };

const itemStore = {};
items.forEach((item) => {
	itemStore[item.id] = item;
});

const store: Store = {
	[ROOT]: root,
	[LIST]: list,
	...itemStore,
} as const;

// PROCESS
preload(store).then((store) => {
	console.log('LOAD STORE', store);

	controller = new Controller(store, events);
	const duration = END_SEQUENCE;
	// controller.start().play();
	controller.start().seek(1720);

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

/* FIXME transition list
 - avoir un argument : placer qui ne déclenche pas de transition;
 -> si valeurs identiques ,pas de transtion -> voir la transition 
 - le seek n'est pas conforme au play;
 - les dimensions semble fantaisistes
 la capture des dimensions peut se faire alors qu'une interpolation est déja en cours et bloquer 
 */
