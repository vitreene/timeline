import { ROOT, MAIN, STRAP, END_SEQUENCE } from '../common/constants';
import { Clock, Timeline } from '../timeline';
import { Tracks } from '../tracks';

import { Eventime, Initial, Store } from '../types';

import '../style.css';

const ID01 = 'hello';
const ID02 = 'world';
const ID03 = 'third';

const ID_COUNTER_01 = 'counter01';
const counter01 = {
	id: ID_COUNTER_01,
	duration: 2000,
	start: 0,
	end: 10,
	complete: { lost: 'PERDU', win: 'GAGNE' },
};

const ID_COUNTER_02 = 'counter02';
const counter02 = {
	id: ID_COUNTER_02,
	duration: 2500,
	start: 100,
	end: 50,
	complete: { lost: 'LOST' /* , win: 'WON' */ },
};

const events: Eventime = {
	startAt: 0,
	name: 'initial',
	channel: MAIN,
	events: [
		{ startAt: 400, name: 'init', channel: MAIN },
		{ startAt: 401, name: 'action01', channel: MAIN },
		{ startAt: 500, name: 'action04', channel: MAIN },
		{
			startAt: 400,
			name: 'counter',
			channel: STRAP,
			data: counter01,
		},
		// {
		// 	startAt: 500,
		// 	name: 'simple',
		// 	channel: STRAP,
		// 	data: { x: 1, id: ID03 },
		// },
		{
			startAt: 860,
			name: 'counter',
			channel: STRAP,
			data: counter02,
		},
		{ startAt: 1500, name: 'action02', channel: MAIN },
		{ startAt: END_SEQUENCE - 300, name: 'action03', channel: MAIN, data: { content: 'FIN' } },
	],
};

const initialID01: Partial<Initial> = {
	className: 'initial',
	content: 'init',
	style: { top: 0, left: 0, color: 'blue', position: 'absolute' },
};

const initialID02: Partial<Initial> = {
	className: 'initial',
	content: ID02,
	style: { 'background-color': 'orange', padding: '1rem', color: 'cyan', position: 'absolute' },
};

const initialID03: Partial<Initial> = {
	className: 'initial',
	content: ID03,

	style: {
		'background-color': 'purple',
		padding: '1rem',
		color: 'yellow',
		position: 'absolute',
		left: '200px',
		top: '200px',
	},
};

const persos: Store = {
	[ROOT]: {
		initial: {
			tag: 'div',
			id: ROOT,
			className: 'root',
		},
		actions: {},
	},
	[ID01]: {
		initial: { ...initialID01, tag: 'div' },
		actions: {
			initial: { ...initialID01, move: ROOT },
			action01: {
				style: { 'font-weight': 'bold' },
				className: 'action01',
				transition: {
					from: { 'font-size': 16, top: 0, left: 400 },
					to: { 'font-size': 32, top: 100, left: 0 },
					duration: 2000,
				},
			},
			init: {
				style: { color: 'red' },
				className: 'init-action02',
			},
			action03: {
				className: 'action03',
			},
		},
	},
	[ID02]: {
		initial: { ...initialID02, tag: 'div' },
		actions: {
			initial: { ...initialID02, move: ROOT },

			action01: {
				style: { 'font-size': 48 },
				className: 'action01-' + ID02,
			},
			['end_' + ID_COUNTER_01]: {
				transition: {
					from: { opacity: 1 },
					to: { opacity: 0 },
					duration: 1000,
				},
			},
			[ID_COUNTER_01]: true, // signifie : j'écoute counter01
		},
		// emit: {
		// 	mousedown: {
		// 		channel: STRAP,
		// 		name: 'move',
		// 		data: { event: ' move-toto' },
		// 	},
		// },
	},
	[ID03]: {
		initial: { ...initialID03, tag: 'div' },
		actions: {
			initial: { ...initialID03, move: ROOT },

			action01: { className: 'action01-' + ID03 },
			action04: {
				transition: {
					from: { 'background-color': 'rgb(10,128,255)' },
					to: { 'background-color': 'rgb(255,50,50)' },
					// from: { 'background-color': 'hsla(90deg,50%,50%,0.1)' },
					// to: { 'background-color': 'hsla(0deg,10%,40%,1)' },
					duration: 1000,
					repeat: 4,
					yoyo: true,
				},
			},
			/* 	['end_' + ID_COUNTER_02]: {
				transition: {
					from: { opacity: 1 },
					to: { opacity: 0.7 },
					duration: 500,
				},
			}, */
			[ID_COUNTER_02]: true,
		},
		emit: {
			mousedown: {
				channel: STRAP,
				name: 'move',
				data: { event: 'move-event' },
			},
		},
	},
};

// rendre Clock dispo dans Tm !
// simplifier la construction de Tm
// export const store = new PersoStore(Tm.addEvent);

// const Tm = new Timeline({actions, events});
// const Clock = new Timer({ endsAt: END_SEQUENCE });
// const Queue = new QueueActions(render);

// const Main = new PersoChannel({ queue: Queue, timer: Clock });
// const Straps = new StrapChannel({ queue: Queue, timer: Clock });

// Main.addStore(actions);
// Straps.addStore(actions);

// Tm.addChannel(Main);
// Tm.addChannel(Straps);

// Tm.addEvent(events);

// console.log(Tm);

// const tracks = new Tracks(Tm.run, Tm.runNext);
// Clock.on(tracks.run);

// Clock.on(Tm.run);
// Clock.on(Tm.runNext);

// setTimeout(() => {
// 	debugger;
// }, 2000);

// setTimeout(() => {
// 	console.log('---------seek 2000');
// 	Clock.seek(2000);
// }, 1400);

// setTimeout(() => {
// 	Clock.seek(800);
// 	console.log('---------seek 800');
// }, 2000);

// setTimeout(() => {
// 	console.log('---------play');
// 	Clock.play();
// }, 2400);

// const STpause = 600;
// setTimeout(() => {
// 	Clock.pause();
// 	console.log('---------pause ' + STpause);
// }, STpause);

// setTimeout(() => {
// 	console.log('---------pause');
// 	Clock.pause();
// }, END_SEQUENCE);

//SLIDER////////////
const telco = document.createElement('div');
telco.id = 'telco';

const slider = document.createElement('input');
slider.setAttribute('type', 'range');

slider.addEventListener('mousedown', () => {
	slider.addEventListener('mousemove', mousemove);
});
slider.addEventListener('mouseup', () => {
	slider.removeEventListener('mousemove', mousemove);
});

function mousemove(e: Event): void {
	const el = e.target as HTMLInputElement;
	const progress = (Number(el.value) * END_SEQUENCE) / 100 - 100;
	Clock.seek(progress > 0 ? progress : 0);
}

const playButton = document.createElement('button');
playButton.innerText = 'play';
playButton.addEventListener('click', () => Clock.play());

const pauseButton = document.createElement('button');
pauseButton.innerText = 'pause';
pauseButton.addEventListener('click', () => Clock.pause());

telco.appendChild(playButton);
telco.appendChild(slider);
telco.appendChild(pauseButton);
document.body.appendChild(telco);

const Tm = new Timeline({ persos, events });
console.log(Tm);

const tracks = new Tracks(Tm.run, Tm.runNext);
Clock.on(tracks.run);

Clock.start(0);
