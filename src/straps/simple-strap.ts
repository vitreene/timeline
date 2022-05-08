import { CbStatus } from '../clock';
import { STRAP } from '../common/constants';
import { Strap } from './strap';

export class SimpleStrap extends Strap {
	static publicName = 'simple';

	run = (status: CbStatus, _state: any) => {
		const state = !_state?.startTime ? this.init(status, _state) : _state;

		const x = state.x + 0.5;

		this.next(
			{
				name: 'simple',
				channel: STRAP,
				data: { ...state, x },
			},
			status
		);

		this.queue.add(state.id, { style: { transform: `translateX(${x}px)` } });
	};

	init = (status: CbStatus, state: any) => {
		const startTime = status.currentTime;
		const endTime = startTime + 1000;
		const x = state.x || 100;
		const initState = { ...state, x, startTime, endTime };
		return initState;
	};
}
