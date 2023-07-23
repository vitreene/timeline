import { Strap } from './strap';

interface CounterProps {
	duration: number;
	start: number;
	end: number;
	complete?: any;
}

const defaultState = {
	id: 'counter00',
	duration: 2000,
	start: 0,
	end: 100,
	counter: 0,
	frequency: 100,
};

export class Counter extends Strap {
	static type = 'counter';

	duration: number;
	start: number;
	end: number;
	counter: number;
	frequency: number;
	progress = 0;
	sign = 1;

	constructor(props: CounterProps) {
		super();
		const defaults = { ...defaultState, ...props };
		this.duration = defaults.duration;
		this.start = defaults.start;
		this.end = defaults.end;
		this.frequency = defaults.duration / Math.abs(defaults.end - defaults.start) || defaults.frequency;
		this.sign = Math.sign(defaults.end - defaults.start);
	}

	next = (delta: number) => {
		this.progress += delta;
		const elapsed = Math.round(this.progress / this.frequency);
		const counter = this.start + elapsed * this.sign;

		if (this.progress >= this.duration) {
			this.progress = this.duration;
			this.counter = counter;
			// console.log('DONE', this.progress, this.counter);
			return { value: { content: this.counter }, done: true };
		} else if (counter !== this.counter) {
			this.counter = counter;
			// console.log('NEXT', this.progress, this.counter);
			return { value: { content: this.counter }, done: false };
		}
		return { value: null, done: false };
	};
}
