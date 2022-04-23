import { Timer } from '../clock';
import { Timeline } from '../timeline';
import { PersoChannel } from '../channel-perso';
import { StrapChannel } from '../channel-strap';
import { QueueActions } from '../queue';

import { Action, ChannelName, Eventime, Initial, Store } from '../types';
import { createPerso } from '../render/create-perso';
import { diff } from '../common/utils';
import { Tracks } from '../tracks';

const { MAIN, STRAP } = ChannelName;
const END_SEQUENCE = 4000;

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
		{
			startAt: 400,
			name: 'counter',
			channel: STRAP,
			data: counter01,
		},
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

const actions: Store = {
	[ID01]: {
		initial: { ...initialID01, tag: 'div' },
		actions: {
			initial: initialID01,
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
			initial: initialID02,
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
	},
	[ID03]: {
		initial: { ...initialID03, tag: 'div' },
		actions: {
			initial: initialID03,
			action01: { className: 'action01-' + ID03 },
			['end_' + ID_COUNTER_02]: {
				transition: {
					from: { opacity: 1 },
					to: { opacity: 0.7 },
					duration: 500,
				},
			},
			[ID_COUNTER_02]: true,
		},
	},
};

const Tm = new Timeline();
const Clock = new Timer({ endsAt: END_SEQUENCE });
const Queue = new QueueActions(render);
const Main = new PersoChannel({ queue: Queue, timer: Clock });
const Straps = new StrapChannel({ queue: Queue, timer: Clock });

console.log(Tm);

Main.addStore(actions);
Straps.addStore(actions);

Tm.addChannel(Main);
Tm.addChannel(Straps);

Tm.addEvent(events);

const tracks = new Tracks(Tm.run, Tm.runNext);
Clock.on(tracks.run);

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

// PERSOS////////////
const root = document.getElementById('app');
const store = new Map<string, any>();

for (const id in actions) {
	const perso = createPerso(id, actions[id].initial);
	store.set(id, perso);
	root.appendChild(perso());
}

Clock.start(0);

// RENDER ////////////
let precUpdate = {};
function render(update: Partial<Action>) {
	for (const id in update) {
		const up = diff(precUpdate[id], update[id]);
		precUpdate[id] = { ...update[id] };
		up && store.has(id) && store.get(id)(up);
	}
}
