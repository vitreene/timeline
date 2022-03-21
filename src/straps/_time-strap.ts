import { Status } from '../clock';
import { ChannelName } from '../types';
import { Strap } from './strap';

// export function timeStrap({ time, status }) {
// 	console.log('timeStrap', this);

// 	return time;
// }

/* 
Minuteur
- s'abonner a timer/secondes
- count(secondes)
- stop
- emit count
- emit lost
*/

const DEFAULT = '1/10';
const { MAIN } = ChannelName;

const props = { duration: 2000, frequency: 1, reaction: { lost: 'PERDU', win: 'GAGNE' } };
interface StrapMinuteurProps {
	duration: number;
	frequency: number;
	reaction: {
		[status: string]: string;
	};
}
export class Counter extends Strap {
	static publicName = 'counter';
	start: number = null;
	duration = 0;
	counter = 0;
	reactions: StrapMinuteurProps['reaction'];
	freq = 1000;

	init = (data: StrapMinuteurProps = props) => {
		console.log('INIT', data);
		data.frequency && (this.freq = 1000 / data.frequency);
		this.duration = data.duration || 10e3;
		this.reactions = data.reaction;
		this.timer.on(this.count);
	};

	count = (status: Status) => {
		if (this.start === null) this.start = status.currentTime;
		if (this.counter * this.freq + this.start >= status.currentTime - 1000) return;

		this.counter = Math.round((status.currentTime - this.start) / this.freq);
		const elapsed = this.duration - this.counter * this.freq;
		console.log(this.counter, elapsed);

		this.addEvent(
			{
				name: 'counter',
				channel: MAIN,
				data: { content: this.counter },
			},
			status
		);

		if (elapsed <= 0) {
			console.log('END');

			this.stop();
			this.addEvent(
				{
					name: 'end-counter',
					channel: MAIN,
					data: { content: this.reactions.lost },
				},
				status
			);
		}
	};

	stop = () => this.timer.off(this.count);
}
