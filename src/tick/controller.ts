import { Timer } from './timer';
import { Ticker } from './ticker';
import { Display } from './display';
import { Actionner } from './actionner';
import { LoopEvent } from './loop-event';

import { APP } from '.';

import type { Store, DeltaFn, MapEvent, TimerCallback } from './types';

export class Controller {
	timer = new Timer();
	ticker = new Ticker();
	loopEvent: LoopEvent = null;
	display: Display;

	constructor(store: Store, events: MapEvent) {
		this.display = new Display(APP, store);
		const actionner = new Actionner(this.display);
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

	registerActions = (store: Store) => {
		for (const id in store) {
			const perso = store[id];
			this.loopEvent.actionner.add(id, perso.actions);
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
		this.timer.wait(wait);
		return this.pause();
		// manquent :
		// bloquer les tweens
		// faire attendre la fonction suivante
	};
	/*
	wait pourrait fonctionner comme pause, pour le Timer
	*/
	/* 	wait = (wait = 0) => {
			let ticker = new Ticker();
			let timer = new Timer();
			const delTimer = ticker.handlers.store(timer.update);
			timer.handlers.store(({ options: { time } }) => {
					console.log('oh, wait', time);
					if (time >= wait) {
							delTimer();
							timer = null;
							ticker = null;
							this.play();
					}
			});
			ticker.start();
			ticker.play();

			return this.pause();
	}; */
	log = () => {
		console.log(this);
		return this;
	};
}
