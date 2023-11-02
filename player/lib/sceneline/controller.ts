import { Timer } from './timer';
import { Ticker } from './ticker';
import { Display } from './display';
import { Actionner } from './actionner';
import { LoopEvent } from './loop-event';

import { APP } from './constants';

import type { PersoStore, DeltaFn, MapEvent, TimerCallback, PersoMediaStore } from '~/main';

export class Controller {
	timer = new Timer();
	ticker = new Ticker();
	loopEvent: LoopEvent = null;
	display: Display;
	sounds = new Map<string, any>();

	constructor(store: PersoMediaStore, events: MapEvent) {
		this.display = new Display(APP, store.persos);

		this.sounds.set('sound01', (x) => console.log('SOUND--->', x));
		const actionner = new Actionner(this.display, this.sounds);

		this.loopEvent = new LoopEvent(actionner);
		this.loopEvent.resetPersos = this.display.reset;

		this.ticker.handlers.store(this.timer.update);
		this.ticker.handlers.store(actionner.updateTransitions);
		this.ticker.framers.store(actionner.flush);

		this.registerEvents(events);
		this.registerActions(store);
	}

	registerEvents = (events: MapEvent) => {
		this.loopEvent.add(events);
		this.timer.handlers.store(this.loopEvent.update);
	};

	registerActions = (store: PersoMediaStore) => {
		for (const type in store) {
			const elements = store[type];
			for (const id in elements) {
				const perso = elements[id];
				this.loopEvent.actionner.add(id, perso.actions);
			}
		}
	};

	addToTick = (fn: DeltaFn) => {
		return this.ticker.handlers.store(fn);
	};

	addToTimer = (fn: TimerCallback) => {
		return this.timer.handlers.store(fn);
	};

	reset = () => {
		this.ticker.reset();
		return this;
	};
	play = () => {
		console.log('PLAY');
		this.ticker.play();
		return this;
	};
	pause = () => {
		console.log('PAUSE');

		this.ticker.pause();
		return this;
	};
	stop = () => {
		this.ticker.stop();
		return this;
	};
	start = () => {
		this.ticker.start();
		return this;
	};
	seek = (time = 0) => {
		console.log('SEEK');

		this.pause();
		this.timer.seek(time);
		this.loopEvent.seek(time);

		return this;
	};

	wait = (wait = 0) => {
		console.log('WAIT', wait);

		const waitTimer = new Timer();
		const waitTicker = new Ticker();
		const abortTimer = waitTicker.handlers.store(waitTimer.update);
		waitTimer.handlers.store(({ options }) => {
			const { time } = options;
			if (time >= wait) {
				abortTimer();
				waitTicker.stop();
				this.play();
			}
		});
		waitTicker.start();
		waitTicker.play();
		return this.pause();
	};

	log = () => {
		console.log(this);
		return this;
	};
}
