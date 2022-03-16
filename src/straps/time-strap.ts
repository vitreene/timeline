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

const props = { duration: 5, reaction: { lost: 'PERDU', win: 'GAGNE' } };
interface StrapMinuteurProps {
	duration: number;
	reaction: {
		[status: string]: string;
	};
}
export class Counter extends Strap {
	static publicName = 'counter';
	start: number = null;
	duration: number;
	secondes: number;
	reactions: StrapMinuteurProps['reaction'];

	init(data: StrapMinuteurProps = props) {
		console.log('INIT', data);

		this.duration = data.duration || 10e3;
		this.reactions = data.reaction;
		this.timer.on(this.count);
	}

	//FIXME caler sur le temps de départ
	count = (status: Status) => {
		if (this.secondes === status.timers.seconds) return;

		this.secondes = status.timers.seconds;
		if (this.start === null) this.start = this.secondes;
		const elapsed = this.duration + (this.start - this.secondes);
		const content = Math.round(elapsed);
		// console.log(status.currentTime, content);

		this.addEvent(
			{
				name: 'counter',
				channel: MAIN,
				data: { content },
			},
			status
		);

		// this.emitter.emit([DEFAULT_NS, 'update-counter'], {	content});

		if (elapsed <= 0) {
			this.stop();

			// this.emitter.emit([STRAP, this.reactions.lost]);
		}
	};

	stop = () => this.timer.off(this.count);
}
