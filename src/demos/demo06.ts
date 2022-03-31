import { Timer } from '../clock';
import { Timeline } from '../timeline';
import { PersoChannel } from '../channel-perso';
import { StrapChannel } from '../channel-strap';
import { QueueActions } from '../queue';

import { Action, ChannelName, Eventime, Store } from '../types';
import { objectToString } from '../utils';

const slider = document.createElement('input');
slider.setAttribute('type', 'range');

document.body.appendChild(slider);

const ID = 'hello';
const div = document.createElement('div');
div.id = ID;
div.textContent = 'test demo 002';
document.body.appendChild(div);

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
		{ startAt: 1200, name: 'action02', channel: MAIN },
		{ startAt: END_SEQUENCE - 300, name: 'action03', channel: MAIN, data: { content: 'FIN' } },
	],
};

const actions: Store = {
	[ID]: {
		initial: { style: { top: 0, left: 0 } },
		actions: {
			action01: {
				style: { fontWeight: 'bold', position: 'relative' },
				className: 'action01',
				transition: {
					from: { top: 0, left: 0 },
					to: { top: 100, left: 200 },
					duration: 1000,
				},
			},
			action02: {
				style: { color: 'red' },
				className: 'action02',
				transition: {
					from: { fontSize: 16, left: 200 },
					to: { fontSize: 32, left: 400 },
					duration: 1500,
				},
			},
			action03: {
				// style: { left: 100, fontSize: 32 },
				className: 'action03',
			},
			// counter: {
			// 	style: { backgroundColor: 'cyan' },
			// },
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

Clock.on(Tm.run);
Clock.on(Tm.runNext);

Clock.start(0);

setTimeout(() => {
	Clock.seek(1500);
	console.log('---------seek 2000');
}, 1000);

// setTimeout(() => {
// 	Clock.seek(800);
// 	console.log('---------seek 800');
// }, 1400);

setTimeout(() => {
	Clock.play();
	console.log('---------play');
}, 1600);

// setTimeout(() => {
// 	Clock.pause();
// 	console.log('---------pause 3000');
// }, 3000);

/*
setTimeout(() => {
	console.log('---------pause');
	Clock.pause();
}, END_SEQUENCE);
 */
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

let _style = '';
function render(update: Partial<Action>) {
	const element = update[ID];
	if (element) {
		const style = objectToString(element.style);
		// style !== _style && console.log(style);
		_style = style;
		div.setAttribute('style', style);
		if (element.className) div.classList.add(...element.className.split(' '));
		if (element.content) div.textContent = element.content;
	}
}
