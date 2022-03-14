import { CbStatus, Timer } from 'src/clock';
import { Eventime, Store } from 'src/types';

export interface StrapProps {
	// name: string;
	store: Store;
	timer: Timer;
	addEvent: (event: Eventime) => void;
}

// export function strap(props: StrapProps) {
// 	return class Strap {
// 		name: string;
// 		store: Store = props.store;
// 		timer: Timer = props.timer;
// 	};
// }

export class Strap {
	name: string;
	store: Store;
	timer: Timer;
	addEvent: (event: Partial<Eventime>, status: CbStatus) => void;
	constructor(options: StrapProps) {
		this.timer = options.timer;
		this.store = options.store;
		this.addEvent = options.addEvent;
	}
}
