import { Timer } from './clock';
import { Timeline } from './timeline';
import { PersoChannel } from './channel';
import { QueueActions, Render } from './queue';

import { Action, ChannelName, Eventime, Store } from './types';
import { objectToString } from './utils';

const ID = 'hello';
const div = document.createElement('div');
div.id = ID;
div.textContent = 'test demo 002';
document.body.appendChild(div);

const { MAIN, STRAP } = ChannelName;

const events: Eventime = {
	startAt: 0,
	name: 'first',
	channel: MAIN,
	events: [
		{ startAt: 1000, name: 'action01', channel: MAIN },
		{ startAt: 1200, name: 'action02', channel: MAIN },
		{ startAt: 2000, name: 'action03', channel: MAIN },
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
					duration: 800,
				},
			},
			action02: {
				style: { color: 'red' },
				className: 'action02',
			},
			action03: {
				style: { left: 100, fontSize: 32 },
				className: 'action03',
			},
		},
	},
};

const Tm = new Timeline();
const Clock = new Timer({ endsAt: 2500 });
const Queue = new QueueActions(render);
const Main = new PersoChannel(MAIN, { queue: Queue, timer: Clock });

Main.addStore(actions);

Tm.addChannel(Main);
Tm.addEvent(events);
Clock.subscribe(Tm.run);

Clock.start(0);

// NOTE pause devrait etre invoqué dans Timeline , pas dans Clock
// setTimeout(() => {
// 	Clock.pause();
// }, 1400);

Clock.seek(1700);
// setTimeout(() => {
// 	debugger;
// }, 2000);

function render(update: Partial<Action>) {
	const element = update[ID];
	if (element) {
		const style = objectToString(element.style);
		console.log('RENDER', element);

		div.setAttribute('style', style);
		element.className && div.classList.add(element.className.split(' '));
	}
}
