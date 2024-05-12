import { Actionner } from './actionner';
import { INITIAL } from '../common/constants';

import type { MapEvent } from '../types';

export class LoopEvent {
	events: MapEvent = new Map();
	actionner: Actionner | null = null;
	resetPersos; //this.display.reset
	//definir le contenu de emit
	emitEvent: any[] = [];

	constructor(actionner: Actionner) {
		this.actionner = actionner;
		this.resetPersos = this.actionner.display.reset;
		this.addEmitEvent = this.addEmitEvent.bind(this);
	}

	add(events: MapEvent) {
		// @ts-ignore-
		this.events = new Map([...this.events, ...events]);
	}
	addEmitEvent(emit: any) {
		console.log('addEmitEvent', emit);
		this.emitEvent.push(emit);
	}

	update = ({ options }: { options: { time?: number } }) => {
		this.emitEvent.length && console.log(this.emitEvent);

		const { time } = options;
		// console.log(time);

		for (const emit of this.emitEvent) {
			console.log('emitEvent', emit);

			this.actionner!.update({ ...emit, delta: 0, time });
			if (emit.keep) this.add(new Map([time, emit]));
		}
		this.emitEvent = [];

		if (time != undefined && this.events.has(time)) {
			const events = this.events.get(time);
			console.log('EVENT', time, events);
			(Array.isArray(events) ? events : [events]).forEach((e) =>
				this.actionner!.update({
					...e,
					time,
					delta: 0,
					seek: false,
				})
			);
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
			this.actionner.update({
				...event,
				delta,
				time,
				seek: true,
				name: '',
			});
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
