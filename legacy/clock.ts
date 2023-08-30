import {
	DEFAULT_TIMER,
	MAX_ENDS,
	PAUSE,
	PLAY,
	SEEK,
	SEEKING,
	TICK,
	TIME_INTERVAL,
	TRACK_PAUSE,
} from '../player/src/common/constants';
import type { Time, TrackName } from './tracks';

export type Cb = (status?: CbStatus) => void;
export type Guard = (status?: CbStatus) => boolean;

export interface Status {
	currentTime: number;
	pauseTime: number;
	headTime: number;
	elapsed: number;
	// paused: number;
	delta: number;
	statement: string;
	seekTime?: number;
	timers?: { milliemes: number; centiemes: number; diziemes: number; seconds: number };
}
export interface CbStatus extends Partial<Status> {
	trackName?: TrackName;
	duration?: number;
	endClock?: boolean;
}

interface Props {
	subscribe: Cb[];
	endsAt: number;
	audioContext: { currentTime: number };
}

export const defaultStatus: Status = {
	elapsed: 0,
	pauseTime: 0,
	headTime: 0,
	currentTime: 0,
	statement: PAUSE,
	timers: getTimers(0),
	// paused: 0,
	delta: 0,
};

class Clock {
	raf: number;
	hasAborted = false;
	totalElapsed = 0;
	oldTime = 0;
	tick = new Set<Cb>();
	nextTick = new Set<Cb>();
	timers = new Map<TrackName, CbStatus>();
	subscribers = new Map<string, { guard: Guard; cb: Set<Cb> }>();
	constructor(props: Partial<Props>) {
		this.addFilter('1/100', ({ timers }: Status) => timers.milliemes % 100 === 0);
		this.addFilter(DEFAULT_TIMER, ({ timers }: Status) => timers.centiemes === timers.diziemes * 10);
		this.addFilter('seconds', ({ timers }: Status) => timers.diziemes === timers.seconds * 10);

		this.subscribers.get(DEFAULT_TIMER).cb.store(this.onEndLoop(props.endsAt));
	}

	addFilter(frequency: string, guard: Guard) {
		this.subscribers.set(frequency, { guard, cb: new Set<Cb>() });
	}

	// END CLOCK ///////
	onEndLoop =
		(endClock: number = MAX_ENDS) =>
		({ currentTime }: CbStatus) => {
			if (currentTime >= endClock) {
				this.hasAborted = true;
				console.log('endLOOP', currentTime, endClock, this.hasAborted);
			}
		};
	onComplete = () => {
		this.timers.forEach((timer) => {
			timer.endClock = true;
			this.subscribers.forEach(({ cb }) => cb.forEach((c) => c(timer)));
		});
		this.subscribers.clear();
		this.tick.clear();
	};

	// SUBSCRIPTIONS ///////
	subscribe = (subcription: Cb, frequency: string = DEFAULT_TIMER) => {
		if (frequency === TICK) return this.subscribeTick(subcription);

		if (!this.subscribers.has(frequency))
			return console.error(`Can't subscribe to ${frequency} : unknown frequency.`);
		const { cb } = this.subscribers.get(frequency);

		if (!cb.has(subcription)) {
			cb.store(subcription);
			return this.unSubscribe(subcription, frequency);
		} else console.warn('this subcription already exist', subcription.name);
	};

	unSubscribe = (fct: Cb, frequency: string) => () => this.subscribers.get(frequency).cb.delete(fct);

	subscribeTick = (subcription: Cb) => {
		this.tick.store(subcription);
		return this.unSubscribeTick(subcription);
	};

	unSubscribeTick = (subcription: Cb) => () => this.tick.delete(subcription);

	scheduleNextTick = (subcription: Cb) => this.nextTick.store(subcription);

	private once(fct: Cb) {
		const once: Cb = (timer) => {
			fct(timer);
			this.timers.forEach((t) => console.log('TIMER', timer.currentTime, t.trackName, t.statement));
			this.tick.delete(once);
		};
		this.tick.store(once);
	}

	// LOOP ////////////////
	loop = (initial: number) => {
		this.timers.forEach((timer) => (timer.currentTime = initial - TIME_INTERVAL));
		const start = performance.now() - initial;

		const loop_ = () => {
			if (this.hasAborted) {
				this.onComplete();
				return cancelAnimationFrame(this.raf);
			}
			const now = performance.now();
			const delta = (now - this.oldTime) / 1000;
			this.oldTime = now;
			this.totalElapsed = Math.round(now - start);

			this.timers.forEach((timer) => {
				let tickStatus = timer;
				const elapsed = this.totalElapsed; /* - timer.paused */
				const timers = getTimers(elapsed);

				switch (timer.statement) {
					default:
					case PLAY:
						{
							/* 
							A cause de la différence de fréquence, des trames peuvent etre perdues ; cette boucle force l'exécution de chacune.
							Si la différence entre _currentTime et oldTime n'est pas suffisante, il n'y a pas d'actualisation.
							*/

							const currentTime = elapsed - timer.pauseTime;
							const cents = (currentTime - timer.currentTime) / 10;
							// timer.trackName === 'trackEnglish' && console.log({ currentTime, elapsed, pauseTime: timer.pauseTime });

							for (let c = 1; c <= cents; c++) {
								setTimeout(() => {
									const currentTime_ = currentTime - (cents - c) * 10;
									timer = {
										...timer,
										timers, //
										elapsed,
										currentTime: currentTime_,
										delta,

										headTime: Math.max(timer.headTime, currentTime_),
									};

									this.timers.set(timer.trackName, timer);
									this.subscribers.forEach(({ guard, cb }) => guard(timer) && cb.forEach((c) => c(timer)));
								});
							}

							tickStatus = { ...timer, currentTime };
						}
						break;

					case SEEK:
						{
							this.subscribers.forEach(({ guard, cb }) => guard(timer) && cb.forEach((c) => c(timer)));

							if (timer.headTime < timer.seekTime) {
								/* 
								executer en acceleré (sans timeout) tous les events qui se produisent entre la position headtime et seektime
								en mode PLAY
								 */
								const cents = (timer.seekTime - timer.headTime) / 10;

								for (let c = 1, timer_ = timer; c <= cents; c++) {
									const currentTime_ = timer.seekTime - (cents - c) * 10;
									timer_ = {
										...timer_,
										currentTime: currentTime_,
										headTime: currentTime_,
										delta,
										statement: PLAY,
									};
									this.subscribers.forEach(({ guard, cb }) => guard(timer_) && cb.forEach((c) => c(timer_)));
								}
							}

							timer.currentTime = timer.seekTime;

							timer.headTime = Math.max(timer.headTime, timer.seekTime);
							timer.statement = SEEKING;
							this.timers.set(timer.trackName, timer);
							tickStatus = timer;
						}
						break;

					case SEEKING:
						{
							timer.statement = PAUSE;
							this.timers.set(timer.trackName, timer);
						}
						break;

					case PAUSE:
						{
							timer.pauseTime = elapsed - timer.currentTime;
							this.timers.set(timer.trackName, timer);
							tickStatus = timer;
						}
						break;
				}

				this.tick.forEach((fn) => fn(tickStatus));
			});

			this.nextTick.forEach((fct) => this.once(fct));
			this.nextTick.clear();

			this.raf = requestAnimationFrame(loop_);
		};

		loop_();
	};

	addTimer(trackName: TrackName, timer: CbStatus | undefined) {
		// TODO initialiser certaines propriétés
		this.timers.set(trackName, { ...defaultStatus, ...timer, trackName });
	}

	setTimer(trackName: TrackName, status: Partial<CbStatus>) {
		const timer = this.timers.get(trackName);
		if (!timer) {
			console.warn(`Pas de timer à ce nom : ${trackName}`);
			return;
		}
		this.timers.set(trackName, { ...timer, ...status });
	}

	seekAndPlay(trackName: TrackName, seekTime_: Time) {
		this[SEEK](trackName, seekTime_);
		const seekTime = getTimers(seekTime_).milliemes;
		const pauseTime = this.totalElapsed - seekTime;
		this.scheduleNextTick(() => this.setTimer(trackName, { pauseTime, statement: PLAY }));

		console.log('seekAndPlay', this.nextTick);
	}

	[SEEK](trackName: TrackName, seekTime_: Time) {
		const timer = this.timers.get(trackName);
		if (!timer) {
			console.warn(`Pas de timer à ce nom : ${trackName}`);
			return;
		}
		const seekTime = getTimers(seekTime_).milliemes;
		if (timer.seekTime === seekTime) return;

		console.log(SEEK, trackName, seekTime);
		this.timers.set(trackName, { ...timer, statement: SEEK, seekTime });
	}
}

export class Timer extends Clock {
	constructor(props: Partial<Props>) {
		super(props);
	}

	start(initial = 0) {
		console.log('START', ...this.timers);
		this.loop(initial);
	}

	rewind() {}
	stop() {
		this.hasAborted = true;
	}

	on = (fct: Cb) => this.subscribe(fct, DEFAULT_TIMER);
	off = (fct: Cb) => this.unSubscribe(fct, DEFAULT_TIMER);

	// tick pour Telco et Queue.flush
	onTick = this.subscribeTick;
	offTick = this.unSubscribeTick;
}

function getTimers(elapsed: number) {
	return {
		milliemes: Math.floor(elapsed / 10) * 10,
		centiemes: Math.floor(elapsed / 100) * 10,
		diziemes: Math.floor(elapsed / 100),
		seconds: Math.floor(elapsed / 1000),
	};
}
