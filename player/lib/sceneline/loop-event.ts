import { Actionner } from './actionner';

import type { MapEvent } from '../../types';
import { INITIAL } from '~/common/constants';

export class LoopEvent {
	events: MapEvent = new Map();
	actionner: Actionner = null;
	resetPersos; //this.display.reset
	emitEvent = [];

	constructor(actionner: Actionner) {
		this.actionner = actionner;
		this.resetPersos = this.actionner.display.reset;
		this.addEmitEvent = this.addEmitEvent.bind(this);
	}

	add(events: MapEvent) {
		this.events = new Map([...this.events, ...events]);
	}
	addEmitEvent(emit) {
		console.log('addEmitEvent', emit);
		this.emitEvent.push(emit);
	}

	update = ({ options }) => {
		this.emitEvent.length && console.log(this.emitEvent);

		const { time } = options;
		for (const emit of this.emitEvent) {
			console.log('emitEvent', emit);

			this.actionner.update({ ...emit, delta: 0, time });
			if (emit.keep) this.add(new Map([time, emit]));
		}
		this.emitEvent = [];

		if (this.events.has(time)) {
			console.log('EVENT', time, this.events.get(time));
			this.actionner.update({ ...this.events.get(time), delta: 0, time });
		}
	};

	seek = (seek: number) => {
		this.resetPersos();
		this.actionner.reset();
		this.actionner.update({ time: null, name: INITIAL, delta: 0, seek: true });
		const { range } = selectUpTo(this.events, seek);
		range.forEach((event, time) => {
			const delta = seek - time;
			console.log('SEEK EVENT', time, this.events.get(time));
			this.actionner.update({ ...event, delta, time, seek: true });
		});
	};
}

function selectUpTo(map: MapEvent, upTo: number): { range: MapEvent; last: number } {
	const range: MapEvent = new Map();
	let last = 0;
	map.forEach((v, k) => {
		if (k <= upTo) {
			range.set(k, v);
			last = Math.max(k, last);
		}
	});
	return { range, last };
}
