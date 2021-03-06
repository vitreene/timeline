import { DEFAULT_TIMER, MAX_ENDS, PAUSE, PLAY, SEEK, SEEKING, TICK, TIME_INTERVAL } from './common/constants';

export type Cb = (status?: CbStatus) => void;
export type Guard = (status?: Status) => boolean;

export interface Status {
	elapsed: number;
	timers?: { milliemes: number; centiemes: number; diziemes: number; seconds: number };
	pauseTime: number;
	headTime: number;
	currentTime: number;
	action: string;
	hasAborted: boolean;
	nextTime: number;
	seekTime?: number;
	seekAction?: string;
}
export interface CbStatus extends Partial<Status> {
	endClock?: boolean;
}

interface Props {
	subscribe: Cb[];
	endsAt: number;
	audioContext: { currentTime: number };
}

const defaultStatus: Status = {
	elapsed: 0,
	pauseTime: 0,
	headTime: 0,
	currentTime: 0,
	action: PAUSE,
	hasAborted: false,
	nextTime: TIME_INTERVAL,
	timers: _timers(0),
};

class Clock {
	oldTime = 0;
	raf: number;
	status: Status = defaultStatus;
	tick = new Set<Cb>();
	// AC: Props['audioContext'] = null;
	subscribers = new Map<string, { guard: Guard; cb: Set<Cb> }>();

	constructor(props: Partial<Props>) {
		// this.AC = props.audioContext || new AudioContext();

		this.addTimer('1/100', ({ timers }: Status) => timers.milliemes % 100 === 0);
		this.addTimer(DEFAULT_TIMER, ({ timers }: Status) => timers.centiemes === timers.diziemes * 10);
		this.addTimer('seconds', ({ timers }: Status) => timers.diziemes === timers.seconds * 10);

		this.subscribers.get(DEFAULT_TIMER).cb.add(this.onEndLoop(props.endsAt));
	}

	addTimer(track: string, guard: Guard) {
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

	subscribe = (track: string = DEFAULT_TIMER, subcription: Cb) => {
		if (track === TICK) return this.subscribeTick(subcription);

		if (!this.subscribers.has(track)) return console.error(`Can't subscribe to ${track} : unknown track.`);
		const { cb } = this.subscribers.get(track);

		if (!cb.has(subcription)) {
			cb.add(subcription);
			return this.unSubscribe(track, subcription);
		} else console.warn('this subcription already exist', subcription.name);
	};

	unSubscribe = (track: string, fct: Cb) => () => this.subscribers.get(track).cb.delete(fct);

	subscribeTick = (subcription: Cb) => {
		this.tick.add(subcription);
		return this.unSubscribeTick(subcription);
	};

	unSubscribeTick = (subcription: Cb) => () => this.tick.delete(subcription);

	loop = (initial: number) => {
		let oldTime = -10; // pour d??marrer ?? 0
		const start = performance.now() - initial;

		const _loop = () => {
			if (this.status.hasAborted) {
				this.onComplete();
				return cancelAnimationFrame(this.raf);
			}

			const startTime = performance.now() - start;
			const elapsed = Math.round(startTime);
			const timers = _timers(elapsed);

			switch (this.status.action) {
				default:
				case PLAY:
					{
						/* 
				A cause de la diff??rence de fr??quence, des trames peuvent etre perdues ;
				cette boucle force l'ex??cution de chacune.
				Si la diff??rence entre _currentTime et oldTime n'est pas suffisante,
				il n'y a pas d'actualisation.
				*/
						const currentTime = elapsed - this.status.pauseTime;
						const cents = (currentTime - oldTime) / 10;
						for (let c = 1; c <= cents; c++) {
							setTimeout(() => {
								const _currentTime = currentTime - (cents - c) * 10;
								this.status = {
									...this.status,
									timers,
									elapsed,
									currentTime: _currentTime,
									nextTime: _currentTime + TIME_INTERVAL,
									headTime: Math.max(this.status.headTime, _currentTime),
								};

								oldTime = this.status.currentTime;

								this.subscribers.forEach(({ guard, cb }) => guard(this.status) && cb.forEach((c) => c(this.status)));
							});
						}

						const tickStatus = { ...this.status, currentTime };
						this.tick.forEach((fn) => fn(tickStatus));
					}
					break;

				case SEEK:
					{
						// console.log(SEEK, this.status.seekTime, this.status.currentTime, { ...this.status });

						this.subscribers.forEach(({ guard, cb }) => guard(this.status) && cb.forEach((c) => c(this.status)));
						this.tick.forEach((fn) => fn(this.status));

						oldTime = this.status.currentTime;
						this.status.action = SEEKING;
					}
					break;

				case SEEKING:
					{
						// console.log('** ', SEEKING, { ...this.status });

						this.status.seekAction = undefined;
						this.status.currentTime = this.status.seekTime;
						this.status.action = PAUSE;
					}
					break;

				case PAUSE:
					{
						this.status.pauseTime = elapsed - oldTime;
						this.tick.forEach((fn) => fn(this.status));
					}
					break;
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

	[PLAY]() {
		this.status.action = PLAY;
		console.log(PLAY, this.status);
	}
	[PAUSE]() {
		this.status.action = PAUSE;
	}

	[SEEK](time: number) {
		const headTime = Math.max(this.status.headTime, time);
		const currentTime = this.status.currentTime;
		this.status = { ...this.status, action: SEEK, currentTime, headTime, seekTime: time };
	}

	start(initial = 0) {
		this.status = defaultStatus;
		this.play();
		this.loop(initial);
	}

	rewind() {}
	stop() {
		this.status.hasAborted = true;
	}

	on = (fct: Cb) => this.subscribe(DEFAULT_TIMER, fct);
	off = (fct: Cb) => this.unSubscribe(DEFAULT_TIMER, fct);

	onTick = this.subscribeTick;
	offTick = this.unSubscribeTick;
}

function _milliseconds(time: number) {
	return Math.floor(time * 100) * 10;
}
function _timers(elapsed: number) {
	return {
		milliemes: elapsed,
		centiemes: Math.floor(elapsed / 100) * 10,
		diziemes: Math.floor(elapsed / 100),
		seconds: Math.floor(elapsed / 1000),
	};
}
