import { Status, Timer } from '../clock';
import { Timeline } from '../timeline';
import { Channel } from '../channel';
import { PersoChannel } from '../channel-perso';
import { QueueActions } from '../queue';

import { Action, ChannelName, Eventime, Store, Style } from '../types';
import { objectToString } from '../utils';

const ID = 'hello';
const div = document.createElement('div');
div.id = ID;
div.textContent = 'heelo, Weu deux';
document.body.appendChild(div);

const { MAIN, STRAP } = ChannelName;

const events: Eventime = {
	startAt: 0,
	name: 'first',
	channel: MAIN,
	events: [
		{ startAt: 2000, name: 'action02', channel: MAIN },
		{ startAt: 2000, name: 'quatro', channel: MAIN },
		{
			startAt: 800,
			name: 'move01',
			channel: MAIN,
		},
		{
			startAt: 900,
			name: 'move01',
			channel: STRAP,
		},
		{ startAt: 2000, name: '__third', channel: STRAP },
		{
			startAt: 500,
			name: 'enter',
			channel: MAIN,
		},
	],
};

const actions: Store = {
	[ID]: {
		initial: { style: { top: 0, left: 0 } },
		actions: {
			enter: {
				move: { to: 'id01' },
				transition: {
					from: { x: 50 },
					to: { x: 0 },
					duration: 500,
				},
				style: { y: 500, color: 'red' },
			},
			action02: {
				transition: {
					from: { x: 0 },
					to: { x: 50 },
					duration: 1000,
				},
			},
		},
	},

	perso_02: {
		initial: { style: { top: 0, left: 0 } },
		actions: {
			move01: {
				move: { to: 'id02' },
				style: { y: 0, color: 'blue' },
			},
		},
	},
};
// usage

const Clock = new Timer({ endsAt: 4000 });
const Tm = new Timeline();
const Queue = new QueueActions(render);

const Main = new PersoChannel(MAIN, { queue: Queue, timer: Clock });
Main.addStore(actions);

Tm.addChannel(Main);
Tm.addEvent(events);
Clock.subscribe(Tm.run);

const seconds = ({ elapsed }: Status) => console.log(`${elapsed / 1000} seconde${elapsed > 1000 ? 's' : ''} `);
Clock.subscribe(seconds, 'seconds');

// const centiemes = ({ currentTime }: Status) => console.log(`C : ${currentTime} `);
// Clock.subscribe(centiemes, '1/100');
const tack = ({ currentTime }: Status) => console.log(`tick : ${currentTime} `);
Clock.subscribe(tack, 'tick');

Clock.start(0);

setTimeout(() => {
	Clock.pause();
}, 500);
setTimeout(() => {
	Clock.play();
}, 1000);

setTimeout(() => {
	Clock.stop();
}, 3000);

function render(update: Partial<Action>) {
	const element = update[ID];
	console.log('RENDER', element);
	div.setAttribute('style', objectToString(element.style));
	div.classList.add(element.className.split(' '));
}

const style: Style = { position: 'relative' };

const action01 = { style: { fontWeight: 'bold' }, className: 'toto' };
const action02 = { style };
const action03 = { style: { top: 50, left: 100, color: 'red', fontSize: 32 }, className: 'titi' };
Queue.add('element', action01);
Queue.add('element', action02);
Queue.add('element', action03);

setTimeout(() => {
	Queue.flush();
}, 1000);
