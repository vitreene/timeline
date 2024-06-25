export type TimerCallback = (counter: number) => void;

export class Store<T extends Function> extends Set {
	store = (fn: T) => {
		this.add(fn);
		return () => {
			this.delete(fn);
		};
	};
	reset = () => {
		this.clear();
	};
	update = (data: unknown) => {
		this.forEach((fn) => fn(data));
	};
}

export class Timer extends Store<TimerCallback> {
	isPlaying = false;
	start: number = 0;
	count: number = 0;

	constructor() {
		super();
		this.tick = this.tick.bind(this);
	}

	init() {
		this.start = performance.now();
		this.isPlaying = true;
		this.tick();
	}

	tick() {
		const now = performance.now();
		const count = Math.floor((now - this.start) / 10) * 10;

		if (this.isPlaying) {
			if (this.count != count) {
				this.count = count;
				this.update(count);
			}
			// await Promise.resolve();
			queueMicrotask(this.tick);
			// setTimeout(() => this.tick(), 0);
		}
	}
}

/* 

const counter = new Timer();
const counterCB = (count: number) => {
	if (count < 400) console.log(count);
	else counter.isPlaying = false;
};

counter.add(counterCB);
counter.init(); 

*/
