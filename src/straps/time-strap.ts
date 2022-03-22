import { CbStatus, Status } from '../clock';
import { ChannelName } from '../types';
import { Strap } from './strap';

interface StrapMinuteurProps {
	start: number;
	duration: number;
	frequency: number;
	counter: number;
	complete: {
		[status: string]: string;
	};
}

const { MAIN, STRAP } = ChannelName;

const defaultState = {
	id: 'counter00',
	duration: 4000,
	start: 0,
	end: 100,
	counter: 0,
	frequency: 100,
	complete: { lost: 'PERDU', win: 'GAGNE' }, // mettre des events
};

export class Counter extends Strap {
	static publicName = 'counter';

	init = (status: CbStatus, state: Partial<StrapMinuteurProps>): StrapMinuteurProps => {
		const start = status.currentTime;
		return { ...defaultState, ...state, start };
	};

	run = (status: CbStatus, _state: Partial<StrapMinuteurProps>) => {
		const state = !_state?.start ? this.init(status, _state) : (_state as StrapMinuteurProps);
		this.count(status, state);
	};

	count = (status: CbStatus, state: StrapMinuteurProps) => {
		const counter = Math.round((status.currentTime - state.start) / state.frequency);
		const elapsed = state.duration - counter * state.frequency;
		const canEvent = counter !== state.counter;
		const canEnd = elapsed <= 0;

		if (canEnd) {
			console.log('END');
			this.addEvent(
				{
					name: 'end-counter',
					channel: MAIN,
					data: { content: state.complete.win },
				},
				status
			);
		} else {
			if (canEnd) console.log(console.log('NEXT->END'));

			canEvent &&
				this.addEvent(
					{
						name: 'show_counter',
						channel: MAIN,
						data: { content: counter },
					},
					status
				);
			this.next(
				{
					name: 'counter',
					channel: STRAP,
					data: { ...state, counter },
				},
				status
			);
		}
	};
}
