import { DEFAULT_TIMER, FORWARD, MAX_ENDS, PAUSE, PLAY, SEEK, SEEKING, TICK, TIME_INTERVAL } from './common/constants';
import { Time, TrackName } from './tracks';

export type Cb = (status?: CbStatus) => void;
export type Guard = (status?: CbStatus) => boolean;

export interface Status {
	currentTime: number;
	pauseTime: number;
	headTime: number;
	precTime: number;
	nextTime: number;
	elapsed: number;
	paused: number;
	statement: string;
	seekTime?: number;
	seekAction?: string;
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
	precTime: -TIME_INTERVAL,
	currentTime: 0,
	statement: PAUSE,
	nextTime: TIME_INTERVAL,
	timers: getTimers(0),
	paused: 0,
};

class Clock {
	raf: number;
	status: Status = defaultStatus;
	hasAborted = false;
	totalElapsed: number;
	tick = new Set<Cb>();
	timers = new Map<TrackName, CbStatus>();
	subscribers = new Map<string, { guard: Guard; cb: Set<Cb> }>();
	constructor(props: Partial<Props>) {
		this.addFilter('1/100', ({ timers }: Status) => timers.milliemes % 100 === 0);
		this.addFilter(DEFAULT_TIMER, ({ timers }: Status) => timers.centiemes === timers.diziemes * 10);
		this.addFilter('seconds', ({ timers }: Status) => timers.diziemes === timers.seconds * 10);

		this.subscribers.get(DEFAULT_TIMER).cb.add(this.onEndLoop(props.endsAt));
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

		if (!this.subscribers.has(frequency)) return console.error(`Can't subscribe to ${frequency} : unknown frequency.`);
		const { cb } = this.subscribers.get(frequency);

		if (!cb.has(subcription)) {
			cb.add(subcription);
			return this.unSubscribe(subcription, frequency);
		} else console.warn('this subcription already exist', subcription.name);
	};

	unSubscribe = (fct: Cb, frequency: string) => () => this.subscribers.get(frequency).cb.delete(fct);

	subscribeTick = (subcription: Cb) => {
		this.tick.add(subcription);
		return this.unSubscribeTick(subcription);
	};

	unSubscribeTick = (subcription: Cb) => () => this.tick.delete(subcription);

	// LOOP ////////////////
	loop = (initial: number) => {
		// pour démarrer à 0
		this.timers.forEach((timer) => (timer.precTime = initial - TIME_INTERVAL));

		const start = performance.now() - initial;

		const loop_ = () => {
			if (this.hasAborted) {
				this.onComplete();
				return cancelAnimationFrame(this.raf);
			}
			this.totalElapsed = Math.round(performance.now() - start);

			this.timers.forEach((timer) => {
				const elapsed = this.totalElapsed - timer.paused;
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
							const cents = (currentTime - timer.precTime) / 10;

							for (let c = 1; c <= cents; c++) {
								setTimeout(() => {
									const _currentTime = currentTime - (cents - c) * 10;
									timer = {
										...timer,
										timers, //
										elapsed,
										precTime: _currentTime - TIME_INTERVAL,
										currentTime: _currentTime,
										nextTime: _currentTime + TIME_INTERVAL, //
										headTime: Math.max(timer.headTime, _currentTime),
									};

									timer.precTime = timer.currentTime;
									this.timers.set(timer.trackName, timer);
									this.subscribers.forEach(({ guard, cb }) => guard(timer) && cb.forEach((c) => c(timer)));
								});
							}

							const tickStatus = { ...timer, currentTime };
							this.tick.forEach((fn) => fn(tickStatus));
						}
						break;

					case SEEK:
						{
							timer.precTime = timer.currentTime;
							timer.currentTime = timer.seekTime;
							const totoTimer = {
								...timer,
								toto: 'toto',
							};
							this.subscribers.forEach(({ guard, cb }) => guard(timer) && cb.forEach((c) => c(totoTimer)));

							if (timer.headTime < timer.seekTime) {
								/* 
								executer en acceleré (sans timeout) tous les events qui se produisent entre la position headtime et seektime
								en mode PLAY
								 */
								const cents = (timer.seekTime - timer.headTime) / 10;

								for (let c = 1, timer_ = timer; c <= cents; c++) {
									const _currentTime = timer.seekTime - (cents - c) * 10;
									timer_ = {
										...timer_,
										precTime: _currentTime,
										currentTime: _currentTime,
										nextTime: _currentTime + TIME_INTERVAL, //
										headTime: _currentTime,
										statement: PLAY,
									};

									// this.timers.set(timer.trackName, timer);
									this.subscribers.forEach(({ guard, cb }) => guard(timer_) && cb.forEach((c) => c(timer_)));
								}
							}

							timer.headTime = Math.max(timer.headTime, timer.seekTime);
							timer.statement = SEEKING;
							this.timers.set(timer.trackName, timer);
							this.tick.forEach((fn) => fn(timer));
						}
						break;

					case SEEKING:
						{
							// console.log('** ', SEEKING, { ...timer });

							timer.seekAction = undefined;
							// timer.currentTime = timer.seekTime;
							timer.statement = PAUSE;
							this.timers.set(timer.trackName, timer);
						}
						break;

					case PAUSE:
						{
							timer.pauseTime = elapsed - timer.precTime;
							this.timers.set(timer.trackName, timer);
							this.tick.forEach((fn) => fn(timer));
						}
						break;
				}
			});

			this.raf = requestAnimationFrame(loop_);
		};

		loop_();
	};

	addTimer(trackName: TrackName, timer: CbStatus | undefined) {
		// TODO initialiser certaines propriétés
		this.timers.set(trackName, { ...defaultStatus, ...timer, trackName });
	}

	setTimer(trackName: TrackName, statement: string) {
		const timer = this.timers.get(trackName);
		if (!timer) {
			console.warn(`Pas de timer à ce nom : ${trackName}`);
			return;
		}
		this.timers.set(trackName, { ...timer, statement });
	}

	[SEEK](trackName: TrackName, seekTime_: Time) {
		const timer = this.timers.get(trackName);
		if (!timer) {
			console.warn(`Pas de timer à ce nom : ${trackName}`);
			return;
		}
		const seekTime = getTimers(seekTime_).milliemes;
		if (timer.seekTime === seekTime) return;
		console.log(SEEK, seekTime);
		this.timers.set(trackName, { ...timer, statement: SEEK, seekTime });
	}
}

export class Timer extends Clock {
	constructor(props: Partial<Props>) {
		super(props);
	}

	// [PLAY]() {
	// 	this.timers.forEach((timer) => (timer.statement = PLAY));
	// 	console.log('CLOCK ALL PLAY', this.timers);
	// }
	// [PAUSE]() {
	// 	this.timers.forEach((timer) => (timer.statement = PAUSE));
	// 	console.log('CLOCK ALL PAUSE', this.timers);
	// }

	// [SEEK](time: number) {
	// const headTime = Math.max(this.status.headTime, time);
	// const currentTime = this.status.currentTime;
	// this.status = { ...this.status, statement: SEEK, currentTime, headTime, seekTime: time };
	// }

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

function _milliseconds(time: number) {
	return Math.floor(time * 100) * 10;
}
function getTimers(elapsed: number) {
	return {
		milliemes: Math.floor(elapsed / 10) * 10,
		centiemes: Math.floor(elapsed / 100) * 10,
		diziemes: Math.floor(elapsed / 100),
		seconds: Math.floor(elapsed / 1000),
	};
}
