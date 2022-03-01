import { Timer } from './clock';
import { Timeline } from './timeline';
import { PersoChannel } from './channel';
import { QueueActions } from './queue';

import { ChannelName, Eventime, Store } from './types';
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
		{ startAt: 500, name: 'action01', channel: MAIN },
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
					from: { x: 50 },
					to: { x: 0 },
					duration: 500,
				},
			},
			action02: {
				style: { color: 'red', top: 50 },
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

function render(update) {
	const element = update[ID];
	if (element) {
		const style = objectToString(element.style);
		console.log('RENDER', element);

		div.setAttribute('style', style);
		div.classList.add(element.className.split(' '));
	}
}
