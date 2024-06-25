import { Store } from './store';
import type { TimerCallback } from '../types';

const TIME_LEAP = 10;

export class TimeProvider {
	handlers = new Store<TimerCallback>();
	time = 0;
	elapsed = 0;
	counter: Worker;

	constructor() {
		try {
			this.counter = new Worker(new URL('./worker-timer.ts', import.meta.url));

			this.counter.onmessage = (e) => {
				this.time = e.data;
				this.elapsed += TIME_LEAP;
				this.handlers.update({ delta: TIME_LEAP, options: { time: this.time } });
			};
		} catch (e) {
			console.log(e);
		}
	}
	seek(time: number) {
		this.time = time;
		this.elapsed = time;
	}

	start = () => {
		this.counter.postMessage('start');
	};

	stop = () => {
		this.counter.postMessage('stop');
	};
	terminate = () => {
		this.counter.postMessage('terminate');
	};
}
