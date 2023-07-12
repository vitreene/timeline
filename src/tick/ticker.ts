import { Store } from './store';
import { DeltaFn } from './types';

export class Ticker {
	// timeStamp = 0;
	timePause = 0;
	timeScale = 1;
	timeElapsed = 0;

	paused = false;
	playing = false;
	cancelRaf = new Set<number>();

	handlers = new Store<DeltaFn>();
	framers = new Store<DeltaFn>();

	reset = () => {
		// this.timeStamp = 0;
		this.timePause = 0;
		this.timeScale = 1;
		this.timeElapsed = 0;
	};

	play = () => (this.playing = true);

	pause = () => (this.playing = false);

	stop = () => {
		this.cancelRaf.forEach(cancelAnimationFrame);
		this.playing = false;
		this.handlers.reset();
		this.framers.reset();
		console.log('STOP');
	};

	start = (seconds = 0) => {
		console.log('START', seconds);
		this.reset();
		this.tick(0);
		this.frame();
	};

	tick = (timestamp: number) => {
		const elapsed = timestamp - this.timePause;
		const delta = elapsed - this.timeElapsed;
		this.timeElapsed = elapsed;

		if (this.playing === false) this.paused = true;

		if (this.playing) {
			if (this.paused === true) {
				this.paused = false;
				this.timePause = timestamp - this.timeElapsed;
			}
			// console.log('TICK', this.timeElapsed, delta);
			// this.timeStamp = timestamp;
			this.handlers.update(delta * this.timeScale);
		}

		this.raf((tm) => Promise.resolve(this.tick(tm)));
	};

	frame = () => {
		this.framers.update(null);
		this.raf(this.frame);
	};

	raf = (fn: DeltaFn) => {
		this.cancelRaf.add(requestAnimationFrame(fn));
	};
}
