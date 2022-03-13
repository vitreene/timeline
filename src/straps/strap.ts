import { Timer } from 'src/clock';
import { Store } from 'src/types';

export interface StrapProps {
	// name: string;
	store: Store;
	timer: Timer;
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
	constructor(options: StrapProps) {
		this.timer = options.timer;
		this.store = options.store;
	}
}
