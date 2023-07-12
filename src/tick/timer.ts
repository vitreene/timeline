import { Store } from './store';
import type { TimerCallback } from './types';

/*
Timer update chaque 1/100s (rafraichissement raf)
register store
update :
(delta:number)-> set time
store update(time)
*/

const TIME_LEAP = 10;
const TIMER_UPDATE = 100;

export class Timer {
	handlers = new Store<TimerCallback>();
	elapsed = 0;
	time = 0;

	seek(time: number) {
		this.elapsed = time;
	}

	update = (delta: number) => {
		console.log('TIMER', this.elapsed, delta);

		this.elapsed += delta;
		const elapsed = Math.round(this.elapsed / TIME_LEAP) * TIME_LEAP;
		const consumed = (elapsed - this.time) / TIME_LEAP;

		for (let t = 0; t <= consumed; t++) {
			this.time % TIMER_UPDATE === 0 && Promise.resolve(this.handlers.update({ delta, options: { time: this.time } }));
			this.time += TIME_LEAP;
		}
	};
}
