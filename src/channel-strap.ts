import { CbStatus, Timer } from './clock';
import { QueueActions } from './queue';
import { ChannelName, Store, Transition } from './types';
import { Channel, ChannelProps } from './channel';

export class StrapChannel extends Channel {
	name: ChannelName = ChannelName.STRAP;
	strap = new Map<string, Function>();

	constructor(options) {
		super(options);
		this.registerStrap(simpleStrap);
	}
	run({ name, time, status }: ChannelProps): void {
		if (status.action === 'seek') this.queue.resetState();

		console.log(time, ': strap run ', name, status);
		// if (this.strap.has(name)) this.strap.get(name)({ status, time });
	}

	registerStrap(fn) {
		this.strap.set(fn.name, fn);
	}
}

function simpleStrap({ time, status }) {
	console.log('simpleStrap', status);
	console.log(this);

	return 1;
}
