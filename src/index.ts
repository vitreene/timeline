import { Status, Timer } from './clock';
import { Channel, Timeline } from './timeline';
import { ChannelName, Eventime } from './types';
const div = document.createElement('div');
div.id = 'hello';
div.textContent = 'heelo, Weu deux';
document.body.appendChild(div);
/* 
const clock = new Timer({ endsAt: 4000 });
const control = ({ currentTime }: Status) => console.log('subscribe', currentTime);
const seconds = ({ elapsed }: Status) => console.log('secondes', elapsed);
clock.subscribe(control);
clock.subscribe(seconds, 'seconds');

clock.start(0);
setTimeout(() => {
	clock.pause();
}, 1500);
setTimeout(() => {
	clock.play();
}, 3000);
 */

const events: Eventime = {
	startAt: 0,
	name: 'first',
	channel: ChannelName.MAIN,
	events: [
		{
			startAt: 500,
			name: 'second',
			channel: ChannelName.MAIN,
		},
		{ startAt: 2000, name: 'third', channel: ChannelName.MAIN },
	],
};
// usage
const Main = new Channel(ChannelName.MAIN);
const Clock = new Timer({ endsAt: 2000 });
const Tm = new Timeline();

Tm.addChannel(Main);
Tm.addEvent(events);
Clock.subscribe(Tm.run);

const seconds = ({ elapsed }: Status) => console.log('secondes', elapsed);
Clock.subscribe(seconds, 'seconds');

Clock.start(0);

setTimeout(() => {
	Clock.stop();
}, 1500);
