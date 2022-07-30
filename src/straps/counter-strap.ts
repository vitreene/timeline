import { CbStatus, Status } from '../clock';

import { Strap } from './strap';
import { MAIN, STRAP } from '../common/constants';

interface StrapMinuteurProps {
	track?: string;
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

	run = (status: CbStatus, _state: Partial<StrapMinuteurProps>) => {
		const state = !_state?.startTime ? this.init(status, _state) : (_state as StrapMinuteurProps);
		this.count(status, state);
	};

	init = (status: CbStatus, state: Partial<StrapMinuteurProps>): StrapMinuteurProps => {
		const duration = state.duration || defaultState.duration;
		const frequency = state.frequency || duration / Math.abs(state.end - state.start);
		const startTime = status.currentTime;
		const endTime = startTime + state.duration;
		const initState = { ...defaultState, ...state, frequency, startTime, endTime };
		console.log('COUNTER_INIT', status.currentTime, initState, { ...status });

		return initState;
	};

	count = (status: CbStatus, state: StrapMinuteurProps) => {
		const elapsed = Math.round((status.currentTime - state.startTime) / state.frequency);
		const counter = state.start + elapsed * Math.sign(state.end - state.start);
		const canEvent = counter !== state.counter;
		const canEnd = status.currentTime > state.endTime;

		if (canEnd) {
			// console.log('END-COUNTER', state.id, state.duration, counter);
			this.addEvent(
				{
					name: 'end_' + state.id,
					channel: MAIN,
					data: { content: state.complete.win || counter },
				},
				status
			);
			console.log('NEXT->END');
		} else {
			canEvent && console.log('@@@@@@@COUNTER', status.currentTime, canEvent, counter, state);

			canEvent &&
				this.addEvent(
					{
						name: state.id,
						channel: MAIN,
						track: state.track,
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
