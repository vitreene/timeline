import { Timer } from './timer';
import { Ticker } from './ticker';
import { Display } from './display';
import { Actionner } from './actionner';
import { LoopEvent } from './loop-event';

import { APP } from './constants';

import type { DeltaFn, MapEvent, TimerCallback, Store, PersoId, PersoNode } from '~/main';
import { PersoType as P } from '~/main';
import { INITIAL } from '~/common/constants';
import { Media } from './medias';

export class Controller {
	timer = new Timer();
	ticker = new Ticker();
	loopEvent: LoopEvent = null;
	display: Display;
	medias = new Media();
	handle: Handle;

	constructor(store: Store, events: MapEvent) {
		this.display = new Display(APP, store);

		this.initMedias(store);

		const actionner = new Actionner(this.display, this.medias);
		this.loopEvent = new LoopEvent(actionner);

		this.ticker.handlers.store(this.medias.sync);

		this.ticker.handlers.store(this.timer.update);
		this.ticker.handlers.store(actionner.updateTransitions);
		this.ticker.framers.store(actionner.flush);

		this.registerEvents(events);
		this.registerActions(store);

		this.handle = new Handle(this.loopEvent.addEmitEvent, this.display.persos);
	}

	initMedias(store: Store) {
		for (const id in store) {
			const perso = store[id];
			if (
				perso.type === P.VIDEO ||
				perso.type === P.SOUND
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
			const actions = perso.type === P.SOUND ? perso.actions : { [INITIAL]: perso.initial, ...perso.actions };
			this.loopEvent.actionner.add(id, actions);
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
		this.medias.pause();

		return this;
	};
	stop = () => {
		this.ticker.stop();
		this.medias.stop();
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

class Handle {
	handler;
	persos: Map<PersoId, PersoNode>;
	constructor(handler, persos: Map<PersoId, PersoNode>) {
		this.handler = handler;
		this.persos = persos;
		this.registerPersoEvents();
	}

	registerPersoEvents() {
		this.persos.forEach((perso) => {
			if (perso.emit) {
				console.log('registerPersoEvents', perso.emit);

				perso.node.dataset.id = perso.id;
				for (const ev in perso.emit) {
					perso.node.addEventListener(ev, this);
				}
			}
		});
	}
	handleEvent = (event) => {
		console.log(event.type);

		const persoId = event.target.dataset.id;
		const perso = this.persos.get(persoId);
		const emit = perso.emit[event.type];

		emit.name = persoId;

		emit.data = {
			...emit.data,
			emit: { e: event, type: event.type, id: persoId },
		};

		this.handler(emit);
	};
}
