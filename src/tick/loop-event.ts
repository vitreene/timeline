import { Actionner } from './actionner';

// TODO PROVISOIRE
import { initDiv } from '.';

import type { AddToTick, MapEvent } from './types';

export class LoopEvent {
	events: MapEvent = new Map();
	actionner: Actionner = null;

	constructor(addToTick: AddToTick) {
		this.actionner = new Actionner(addToTick);
	}

	add(events: MapEvent) {
		this.events = new Map([...this.events, ...events]);
	}

	update = ({ options }) => {
		const { time } = options;
		if (this.events.has(time)) {
			console.log('EVENT', time, this.events.get(time));
			this.actionner.update({ ...this.events.get(time), delta: 0, time });
			/*
			// les tweens / straps sont initiées avant queue
			this.queue.add(id, action)
		  
			*/
		}
	};

	seek = (seek: number) => {
		initDiv();
		const { select } = selectUpTo(this.events, seek);
		select.forEach((event, time) => {
			const delta = seek - time;
			this.actionner.update({ ...event, delta, time, seek: true });
		});
	};
}

function selectUpTo(map: MapEvent, upTo: number): { select: MapEvent; last: number } {
	const select: MapEvent = new Map();
	let last = 0;
	map.forEach((v, k) => {
		if (k <= upTo) {
			select.set(k, v);
			last = Math.max(k, last);
		}
	});
	return { select, last };
}
