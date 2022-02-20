import { Status, Timer } from './clock';
const div = document.createElement('div');
div.textContent = 'heelo, Weu deux';
document.body.appendChild(div);

const clock = new Timer({ endsAt: 4000 });
const control = ({ elapsed }: Status) => console.log('subscribe', elapsed);
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
