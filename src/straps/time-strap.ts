import { CbStatus, Status } from '../clock';
import { ChannelName } from '../types';
import { Strap } from './strap';

interface StrapMinuteurProps {
	id: string;
	start: number;
	end: number;
	startTime: number;
	endTime: number;
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
	duration: 2000,
	start: 0,
	end: 100,
	counter: 0,
	frequency: 100,
	complete: { lost: 'lost', win: 'win' }, // mettre des events
};

export class Counter extends Strap {
	static publicName = 'counter';

	init = (status: CbStatus, state: Partial<StrapMinuteurProps>): StrapMinuteurProps => {
		const frequency = state.frequency || defaultState.duration / Math.abs(state.end - state.start);
		const startTime = status.currentTime;
		const endTime = startTime + state.duration;
		const initState = { ...defaultState, ...state, frequency, startTime, endTime };
		return initState;
	};

	run = (status: CbStatus, _state: Partial<StrapMinuteurProps>) => {
		const state = !_state?.startTime ? this.init(status, _state) : (_state as StrapMinuteurProps);
		this.count(status, state);
	};

	count = (status: CbStatus, state: StrapMinuteurProps) => {
		const counter = Math.round((status.currentTime - state.startTime) / state.frequency);
		const canEvent = counter !== state.counter;
		const canEnd = status.currentTime > state.endTime;

		if (canEnd) {
			console.log('END-COUNTER', state.id, state.duration, counter);
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
