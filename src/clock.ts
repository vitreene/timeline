export type Cb = (status?: CbStatus) => void;
export type Guard = (status?: Status) => boolean;

export interface Status {
	elapsed: number;
	timers?: { milliemes: number; centiemes: number; diziemes: number; seconds: number };
	pauseTime: number;
	currentTime: number;
	action: string;
	hasAborted: boolean;
}
export interface CbStatus extends Partial<Status> {
	endClock?: boolean;
}

interface Props {
	subscribe: Cb[];
	endsAt: number;
	audioContext: { currentTime: number };
}

const MAX_ENDS = 10000;
const DEFAULT = '1/10';
export const TIME_INTERVAL = 10;
const defaultStatus: Status = {
	elapsed: 0,
	pauseTime: 0,
	currentTime: 0,
	action: 'pause',
	hasAborted: false,
};

/* 
FIXME : 
RAF n'as pas la fréquence suffisante pour obtenir un passage tous les 1/10, il loupe certains passages
des valeurs ne passent pas parfois, 
		la durée d'execution entre deux comptages fait sauter une étape, le guard ne fonctione plus.


*/
class Clock {
	time = -1;
	raf: number;
	status: Status = defaultStatus;
	tick = new Set<Cb>();
	AC: Props['audioContext'] = null;
	subscribers = new Map<string, { guard: Guard; cb: Set<Cb> }>();

	constructor(props: Partial<Props>) {
		this.AC = props.audioContext || new AudioContext();

		this.addTrack('1/100', ({ timers }: Status) => timers.milliemes % 100 === 0);
		this.addTrack(DEFAULT, ({ timers }: Status) => timers.centiemes === timers.diziemes * 10);
		this.addTrack('seconds', ({ timers }: Status) => timers.diziemes === timers.seconds * 10);

		this.subscribers.get(DEFAULT).cb.add(this.onEndLoop(props.endsAt));
	}

	addTrack(track: string, guard: Guard) {
		this.subscribers.set(track, { guard, cb: new Set<Cb>() });
	}

	onEndLoop =
		(endClock: number = MAX_ENDS) =>
		({ currentTime }: CbStatus) => {
			if (currentTime >= endClock) {
				this.status.hasAborted = true;
				console.log('endLOOP', currentTime, endClock, this.status.hasAborted);
			}
		};
	onComplete = () => {
		const status = { ...this.status, endClock: true };

		this.subscribers.forEach(({ cb }) => cb.forEach((c) => c(status)));
	};

	subscribe = (subcription: Cb, track: string = DEFAULT) => {
		if (track === 'tick') return this.subscribeTick(subcription);

		if (!this.subscribers.has(track)) return console.error(`Can't subscribe to ${track} : unknown track.`);
		const { cb } = this.subscribers.get(track);

		if (!cb.has(subcription)) {
			cb.add(subcription);
			return this.unSubscribe(subcription, track);
		} else console.warn('this subcription already exist', subcription);
	};

	unSubscribe = (fn: Cb, track: string) => () => this.subscribers.get(track).cb.delete(fn);

	subscribeTick = (subcription: Cb) => {
		this.tick.add(subcription);
		return this.unSubscribeTick(subcription);
	};

	unSubscribeTick = (subcription: Cb) => () => this.tick.delete(subcription);

	loop = (initial: number) => {
		const start = this.AC.currentTime - initial;
		const _milliseconds = (time: number) => Math.floor(time * 100) * 10;

		const _loop = () => {
			if (this.status.hasAborted) {
				this.onComplete();
				return cancelAnimationFrame(this.raf);
			}

			const startTime = this.AC.currentTime - start;
			const elapsed = _milliseconds(startTime);
			const timers = {
				milliemes: elapsed,
				centiemes: Math.floor(elapsed / 100) * 10,
				diziemes: Math.floor(elapsed / 100),
				seconds: Math.floor(elapsed / 1000),
			};

			if (this.status.action === 'play') {
				const currentTime = elapsed - this.status.pauseTime;

				if (currentTime !== this.time) {
					this.time = currentTime;
					this.status = {
						...this.status,
						elapsed,
						currentTime,
						timers,
					};
					setTimeout(() => {
						this.subscribers.forEach(({ guard, cb }) => guard(this.status) && cb.forEach((c) => c(this.status)));
					});
				}
				const tickStatus = { ...this.status, currentTime };
				this.tick.forEach((fn) => fn(tickStatus));
			} else {
				this.status.pauseTime = elapsed - this.time;
				this.tick.forEach((fn) => fn(this.status));
			}

			this.raf = requestAnimationFrame(_loop);
		};

		_loop();
	};
}

export class Timer extends Clock {
	constructor(props: Partial<Props>) {
		super(props);
	}

	play() {
		this.status.action = 'play';
	}
	pause() {
		this.status.action = 'pause';
	}
	start(initial = 0) {
		this.status = defaultStatus;
		this.play();
		this.loop(initial);
	}
	rewind() {}
	seek(time: number) {
		this.pause();
		const status = { ...this.status, action: 'seek', currentTime: time };
		this.subscribers.forEach(({ cb }) => cb.forEach((c) => c(status)));
	}
	stop() {
		this.status.hasAborted = true;
	}
}
