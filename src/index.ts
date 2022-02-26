import { Status, Timer } from './clock';
import { Channel, PersoChannel, Timeline } from './timeline';
import { ChannelName, Eventime, Store } from './types';

const div = document.createElement('div');
div.id = 'hello';
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
	perso_01: {
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
	perso_02: {
		move01: {
			move: { to: 'id02' },
			style: { y: 0, color: 'blue' },
		},
	},
};
// usage
const Main = new PersoChannel(MAIN);
Main.addStore(actions);
const Strap = new Channel(STRAP);
const Clock = new Timer({ endsAt: 4000 });
const Tm = new Timeline();

Tm.addChannel(Main);
Tm.addChannel(Strap);
Tm.addEvent(events);
Clock.subscribe(Tm.run);

const seconds = ({ elapsed }: Status) => console.log(`${elapsed / 1000} seconde${elapsed > 1000 ? 's' : ''} `);
Clock.subscribe(seconds, 'seconds');

const centiemes = ({ currentTime }: Status) => console.log(`C : ${currentTime} `);
Clock.subscribe(centiemes, '1/100');

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
