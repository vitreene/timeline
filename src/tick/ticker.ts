import { Store } from './store';
import { DeltaFn } from './types';

export class Ticker {
	timeStamp = 0;
	timePause = 0;
	timeScale = 1;
	timeElapsed = 0;

	paused = false;
	playing = false;
	cancelRaf = null;

	handlers = new Store<DeltaFn>();

	reset = () => {
		this.timeStamp = 0;
		this.timePause = 0;
		this.timeScale = 1;
		this.timeElapsed = 0;
	};

	play = () => (this.playing = true);

	pause = () => (this.playing = false);

	stop = () => {
		cancelAnimationFrame(this.cancelRaf);
		this.playing = false;
		this.handlers.reset();
		console.log('STOP');
	};

	start = (seconds = 0) => {
		console.log('START', seconds);
		this.reset();
		this.tick(0);
	};

	tick = (timestamp: number) => {
		if (this.playing === false) this.paused = true;

		if (this.playing) {
			if (this.paused === true) {
				this.paused = false;
				this.timePause = this.timeStamp - this.timeElapsed;
			}
			const time = timestamp - this.timePause;
			const delta = time - this.timeElapsed;
			this.timeElapsed = time;
			// console.log('TICK', this.timeElapsed, delta);
			this.timeStamp = timestamp;
			this.handlers.update(delta * this.timeScale);
		}

		this.raf(this.tick);
	};

	raf = (fn: DeltaFn) => {
		this.cancelRaf = requestAnimationFrame(fn);
	};
}
