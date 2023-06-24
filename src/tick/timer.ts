import { Store } from './store';
import type { TimerCallback } from './types';

/*
Timer update chaque 1/100s (rafraichissement raf)
register store
update :
(delta:number)-> set time
store update(time)
*/

export class Timer {
	handlers = new Store<TimerCallback>();
	elapsed = 0;
	time = 0;
	waiting = 0;

	seek(time: number) {
		this.elapsed = time;
	}

	wait = (time: number) => {
		this.waiting = time;
	};

	update = (delta: number) => {
		if (this.waiting > 0) {
			this.waiting -= delta;
		} else {
			this.waiting = 0;
			// console.log('TIMER', delta, this.elapsed);
			this.elapsed += delta;
			const time = Math.round(this.elapsed / 10) * 10;
			if (this.time !== time) {
				this.time = time;
				this.time % 100 === 0 && Promise.resolve(this.handlers.update({ delta, options: { time } }));
			}
		}
	};
}
