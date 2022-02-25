export type Cb = (status?: Status) => void;
export type Guard = (status?: Status) => boolean;

export interface Status {
	elapsed: number;
	pauseTime: number;
	currentTime: number;
	isPlaying: boolean;
	hasAborted: boolean;
}

interface Props {
	subscribe: Cb[];
	endsAt: number;
	audioContext: { currentTime: number };
}

const MAX_ENDS = 10000;
class Clock {
	AC: Props['audioContext'] = null;
	subscribers = new Map<string, { guard: Guard; cb: Set<Cb> }>();
	time = -1;
	elapsed = 0;
	pauseTime = 0;
	isPlaying = true;
	raf: number;
	hasAborted = false;

	constructor(props: Partial<Props>) {
		this.AC = props.audioContext || new AudioContext();
		this.addTrack('default', () => true);
		this.addTrack('seconds', ({ elapsed }: Status) => elapsed % 1000 === 0);
		this.subscribers.get('default').cb.add(this.endLoop(props.endsAt));
	}

	addTrack(track: string, guard: Guard) {
		this.subscribers.set(track, { guard, cb: new Set<Cb>() });
	}

	endLoop =
		(endsAt: number = MAX_ENDS) =>
		({ currentTime }: Status) => {
			if (currentTime >= endsAt) this.hasAborted = true;
			this.hasAborted &&
				console.log('endLOOP', currentTime, endsAt, this.hasAborted);
		};

	subscribe = (subcriptions: Cb | Cb[], track: string = 'default') => {
		if (!this.subscribers.has(track))
			return console.error(`Can't subscribe to ${track} : unknown track.`);
		const { cb } = this.subscribers.get(track);
		(Array.isArray(subcriptions) ? subcriptions : [subcriptions]).map(
			(fn: Cb) => {
				if (!cb.has(fn)) {
					cb.add(fn);
					return this.unSubscribe(fn, track);
				} else console.warn('this subcription already exist', fn);
			}
		);
	};

	unSubscribe = (fn: Cb, track: string) => () =>
		this.subscribers.get(track).cb.delete(fn);

	loop = (initial: number) => {
		const start = this.AC.currentTime - initial;

		const _loop = () => {
			if (this.hasAborted) return cancelAnimationFrame(this.raf);

			const elapsed = this._milliseconds(this.AC.currentTime - start);
			!this.isPlaying && (this.pauseTime = elapsed - this.time);
			const currentTime = elapsed - this.pauseTime;

			if (currentTime !== this.time) {
				this.time = currentTime;

				const status = {
					currentTime,
					elapsed,
					isPlaying: this.isPlaying,
					pauseTime: this.pauseTime,
					hasAborted: this.hasAborted,
				};

				setTimeout(() =>
					this.subscribers.forEach(
						({ guard, cb }) => guard(status) && cb.forEach((c) => c(status))
					)
				);
			}
			this.raf = requestAnimationFrame(_loop);
		};
		_loop();
	};

	_milliseconds(time: number) {
		return Math.round(time * 10) * 100;
	}
}

export class Timer extends Clock {
	constructor(props: Partial<Props>) {
		super(props);
	}

	play() {
		this.isPlaying = true;
	}
	pause() {
		this.isPlaying = false;
	}
	start(initial = 0) {
		this.loop(initial);
		this.play();
	}
	rewind() {}
	seek() {}
	stop() {
		this.hasAborted = true;
	}
}
