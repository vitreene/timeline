import { Timer } from './clock';
import { Timeline } from './timeline';
import { PersoChannel } from './channel';
import { QueueActions } from './channel';

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
		action01: {
			style: { fontWeight: 'bold' },
			className: 'action01',
		},
		action02: {
			style: { color: 'red', position: 'relative', top: 50 },
			className: 'action02',
		},
		action03: {
			style: { left: 100, fontSize: 32 },
			className: 'action03',
		},
	},
};

const Tm = new Timeline();
const Main = new PersoChannel(MAIN);
const Clock = new Timer({ endsAt: 2500 });
const Queue = new QueueActions(render);

Main.addStore(actions);
Main.addQueue(Queue);

Tm.addChannel(Main);
Tm.addEvent(events);

Clock.subscribe(Tm.run);
Clock.subscribeTick(Queue.flush);

Clock.start(0);

function render(update) {
	const element = update[ID];
	if (element) {
		const style = objectToString(element.style);
		console.log('RENDER', style);

		div.setAttribute('style', style);
		div.classList.add(element.className.split(' '));
	}
}
