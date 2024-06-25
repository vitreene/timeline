import { Media } from './medias';
import { Persos } from './perso';
import { Ticker } from './ticker';
import { Actionner } from './actionner';
import { LoopEvent } from './loop-event';
import { PersoType as P } from '../types';
import { TimeProvider } from './time-worker-provider';

import { INITIAL } from '../common/constants';
import type { DeltaFn, MapEvent, TimerCallback, Store } from '../types';

export class Controller {
	timer = new TimeProvider();
	ticker = new Ticker();
	loopEvent: LoopEvent;

	persos: Persos;
	medias = new Media();

	constructor(store: Store, events: MapEvent) {
		this.persos = new Persos(store);

		this.initMedias(store);

		const actionner = new Actionner(this.persos, this.medias);
		this.loopEvent = new LoopEvent(actionner);

		this.ticker.handlers.store(this.medias.sync);
		this.ticker.handlers.store(actionner.initMoveTransitions);
		this.ticker.handlers.store(actionner.updateTransitions);

		this.ticker.framers.store(actionner.flush);

		this.registerEvents(events);
		this.registerActions(store);

		this.persos.addHandler(this.loopEvent.addEmitEvent);
		console.log(this.persos);
	}

	initMedias(store: Store) {
		for (const id in store) {
			const perso = store[id];
			if (
				perso &&
				(perso.type === P.VIDEO || perso.type === P.SOUND)
				//|| perso.type === P.AUDIO
			) {
				// TODO clarifier quand passer dans medias : ici c'est pas utile, définition va evlouer pour devenir Perso
				//@ts-ignore
				this.medias.store.set(id, perso);
			}
		}
	}

	registerEvents = (events: MapEvent) => {
		this.loopEvent.add(events);
		this.timer.handlers.store(this.loopEvent.update);
	};

	registerEmits() {}

	registerActions = (store: Store) => {
		for (const id in store) {
			const perso = store[id];
			if (perso) {
				const actions = perso.type === P.SOUND ? perso.actions : { [INITIAL]: perso.initial, ...perso.actions };
				this.loopEvent.actionner!.add(id, actions!);
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

	isPlaying = false;
	timeProvider: TimeProvider;
	play = () => {
		this.timer.start();
		console.log('PLAY');
		this.ticker.play();
		this.isPlaying = true;
		return this;
	};
	pause = () => {
		console.log('PAUSE');
		this.ticker.pause();
		this.medias.pause();
		this.isPlaying = false;
		// this.timer.pause();
		return this;
	};
	stop = () => {
		this.ticker.stop();
		this.medias.stop();
		this.isPlaying = false;
		this.timer.stop();

		return this;
	};
	start = () => {
		this.ticker.start();
		this.medias.start();

		return this;
	};
	seek = (time = 0) => {
		console.log('SEEK');

		this.pause();
		this.timer.seek(time);
		this.loopEvent.seek(time);
		this.medias.seek(time);

		return this;
	};

	// FIXME marche pas
	// pourrait etre delayed action wait(time, event) ?
	/* wait = (wait = 0) => {
		console.log('WAIT', wait);

		const waitTimer = new Timer();
		const waitTicker = new Ticker();
		const abortTimer = waitTicker.handlers.store(waitTimer.update);
		waitTimer.handlers.store(({ options }) => {
			const { time } = options;
			if (time! >= wait) {
				abortTimer();
				waitTicker.stop();
				this.play();
			}
		});
		waitTicker.start();
		waitTicker.play();
		return this.pause();
	}; */

	log = () => {
		console.log(this);
		return this;
	};
}
