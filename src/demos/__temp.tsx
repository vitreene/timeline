//@ts-nocheck
import { Dynamic, spread } from 'solid-js/web';
import { Accessor, createSignal, splitProps } from 'solid-js';

import { Timer } from '../clock';
import { Timeline } from '../timeline';
import { PersoChannel } from '../channel-perso';
import { StrapChannel } from '../channel-strap';
import { Attribute, QueueActions } from '../queue';

import { Action, ChannelName, Eventime, Store } from '../types';

const ID01 = 'hello';
const ID02 = 'world';
const { MAIN, STRAP } = ChannelName;
const END_SEQUENCE = 4000;

const counter01 = {
	id: 'counter01',
	duration: 2000,
	start: 0,
	end: 10,
	complete: { lost: 'PERDU', win: 'GAGNE' },
};

const events: Eventime = {
	startAt: 0,
	name: 'first',
	channel: MAIN,
	events: [
		{ startAt: 400, name: 'action01', channel: MAIN },
		{
			startAt: 400,
			name: 'counter',
			channel: STRAP,
			data: counter01,
		},
		{ startAt: 1500, name: 'action02', channel: MAIN },
		{ startAt: END_SEQUENCE - 300, name: 'action03', channel: MAIN, data: { content: 'FIN' } },
	],
};

const actions: Store = {
	[ID01]: {
		initial: { className: 'initial', content: 'init', tag: 'div', style: { top: 0, left: 0, color: 'blue' } },
		actions: {
			action01: {
				style: { 'font-weight': 'bold', position: 'relative' },
				className: 'action01',
				transition: {
					from: { 'font-size': 16, top: 0, left: 0 },
					to: { 'font-size': 32, top: 100, left: 400 },
					duration: 4000,
				},
			},
			action02: {
				style: { color: 'red' },
				className: 'action02',
			},
			action03: {
				className: 'action03',
			},
		},
	},
	[ID02]: {
		initial: { className: 'initial', content: ID02, tag: 'div', style: { 'background-color': 'orange', color: 'blue' } },
		actions: {
			action01: {
				style: { 'font-size': 48 },
				className: 'action01',
			},
		},
	},
};
const Tm = new Timeline();
const Clock = new Timer({ endsAt: END_SEQUENCE });
const Queue = new QueueActions(viewer);
const Main = new PersoChannel({ queue: Queue, timer: Clock });
const Straps = new StrapChannel({ queue: Queue, timer: Clock });

console.log(Tm);

Main.addStore(actions);
Straps.addStore(actions);

Tm.addChannel(Main);
Tm.addChannel(Straps);
Tm.addEvent(events);

Clock.on(Tm.run);
Clock.on(Tm.runNext);

Clock.start(0);

// setTimeout(() => {
// 	debugger;
// }, 2000);

setTimeout(() => {
	console.log('---------seek 2000');
	Clock.seek(2000);
}, 1400);

setTimeout(() => {
	Clock.seek(800);
	console.log('---------seek 800');
}, 2000);

setTimeout(() => {
	console.log('---------play');
	Clock.play();
}, 2400);

// setTimeout(() => {
// 	Clock.pause();
// 	console.log('---------pause 2000');
// }, 2000);

setTimeout(() => {
	console.log('---------pause');
	Clock.pause();
}, END_SEQUENCE);

// https://github.com/solidjs/solid/issues/380
function persoFactory(id = ID01, { tag = 'div', ...initial }) {
	initial.children = initial.content;
	const el = document.createElement(tag);
	el.id = id;

	for (const attr in initial) {
		if (attr === 'children') {
			el.innerHTML = initial[attr];
		} else {
			el.setAttribute(attr, initial[attr]);
		}
	}

	return function Perso(props) {
		spread(el, props);
		return el;
	};
}

const storePerso = new Map<string, (props: any) => HTMLElement>();
storePerso.set(ID01, persoFactory(ID01, actions[ID01].initial));

type ViewProps = Partial<Action & { class: Action['className']; children: any }>;

const [update, setUpdate] = createSignal<Partial<Action>>();

export function viewer(update: { [id: string]: Partial<Attribute> }) {
	const ups = {};
	for (const id in update) {
		const { className, content, ..._up } = update[id];
		const up: ViewProps = _up;
		up.id = id;
		up.class = className as Action['className'];
		up.tag = 'div';
		up.children = content;
		ups[id] = up;
	}

	setUpdate(ups);
}

export const App = () => {
	return update() ? [storePerso.get(ID01)(update)] : null;
};

// export const App = () => View({ id: 'danger', content: 'Mefi', style: { 'background-color': 'red' }, tag: 'h1' });
