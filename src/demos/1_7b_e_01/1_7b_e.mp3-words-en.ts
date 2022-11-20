import { MAIN, THR3D } from '../../common/constants';
import { Eventime } from '../../types';

const wordsCuesEN = [
	{ Word: 'As', 'Start Timecode': '00:00:00.45', 'End Timecode': '00:00:00.69', Speaker: 'Speaker1' },
	{ Word: 'you', 'Start Timecode': '00:00:00.69', 'End Timecode': '00:00:00.81', Speaker: 'Speaker1' },
	{ Word: 'have', 'Start Timecode': '00:00:00.81', 'End Timecode': '00:00:00.99', Speaker: 'Speaker1' },
	{ Word: 'seen,', 'Start Timecode': '00:00:00.99', 'End Timecode': '00:00:01.50', Speaker: 'Speaker1' },
	{ Word: 'electricity', 'Start Timecode': '00:00:01.50', 'End Timecode': '00:00:02.22', Speaker: 'Speaker1' },
	{ Word: 'presents', 'Start Timecode': '00:00:02.22', 'End Timecode': '00:00:02.67', Speaker: 'Speaker1' },
	{ Word: 'risks.', 'Start Timecode': '00:00:02.67', 'End Timecode': '00:00:03.37', Speaker: 'Speaker1' },
	{ Word: 'If', 'Start Timecode': '00:00:03.39', 'End Timecode': '00:00:03.69', Speaker: 'Speaker1' },
	{ Word: 'we', 'Start Timecode': '00:00:03.69', 'End Timecode': '00:00:03.84', Speaker: 'Speaker1' },
	{ Word: 'know', 'Start Timecode': '00:00:03.84', 'End Timecode': '00:00:03.99', Speaker: 'Speaker1' },
	{ Word: 'these', 'Start Timecode': '00:00:03.99', 'End Timecode': '00:00:04.20', Speaker: 'Speaker1' },
	{ Word: 'risks,', 'Start Timecode': '00:00:04.20', 'End Timecode': '00:00:04.59', Speaker: 'Speaker1' },
	{ Word: 'we', 'Start Timecode': '00:00:04.59', 'End Timecode': '00:00:04.74', Speaker: 'Speaker1' },
	{ Word: 'can', 'Start Timecode': '00:00:04.74', 'End Timecode': '00:00:04.89', Speaker: 'Speaker1' },
	{ Word: 'prevent', 'Start Timecode': '00:00:04.89', 'End Timecode': '00:00:05.25', Speaker: 'Speaker1' },
	{ Word: 'them.', 'Start Timecode': '00:00:05.25', 'End Timecode': '00:00:05.67', Speaker: 'Speaker1' },
	{ Word: 'That', 'Start Timecode': '00:00:06.48', 'End Timecode': '00:00:06.72', Speaker: 'Speaker1' },
	{ Word: 'is', 'Start Timecode': '00:00:06.72', 'End Timecode': '00:00:06.84', Speaker: 'Speaker1' },
	{ Word: 'why', 'Start Timecode': '00:00:06.84', 'End Timecode': '00:00:07.05', Speaker: 'Speaker1' },
	{ Word: 'it', 'Start Timecode': '00:00:07.05', 'End Timecode': '00:00:07.14', Speaker: 'Speaker1' },
	{ Word: 'is', 'Start Timecode': '00:00:07.14', 'End Timecode': '00:00:07.29', Speaker: 'Speaker1' },
	{ Word: 'essential', 'Start Timecode': '00:00:07.29', 'End Timecode': '00:00:07.83', Speaker: 'Speaker1' },
	{ Word: 'to', 'Start Timecode': '00:00:07.83', 'End Timecode': '00:00:07.98', Speaker: 'Speaker1' },
	{ Word: 'assess', 'Start Timecode': '00:00:07.98', 'End Timecode': '00:00:08.37', Speaker: 'Speaker1' },
	{ Word: 'the', 'Start Timecode': '00:00:08.37', 'End Timecode': '00:00:08.49', Speaker: 'Speaker1' },
	{ Word: 'electrical', 'Start Timecode': '00:00:08.49', 'End Timecode': '00:00:08.94', Speaker: 'Speaker1' },
	{ Word: 'risk', 'Start Timecode': '00:00:08.94', 'End Timecode': '00:00:09.27', Speaker: 'Speaker1' },
	{ Word: 'in', 'Start Timecode': '00:00:09.27', 'End Timecode': '00:00:09.45', Speaker: 'Speaker1' },
	{ Word: 'the', 'Start Timecode': '00:00:09.45', 'End Timecode': '00:00:09.57', Speaker: 'Speaker1' },
	{ Word: 'work', 'Start Timecode': '00:00:09.57', 'End Timecode': '00:00:09.84', Speaker: 'Speaker1' },
	{ Word: 'you', 'Start Timecode': '00:00:09.84', 'End Timecode': '00:00:09.96', Speaker: 'Speaker1' },
	{ Word: 'are', 'Start Timecode': '00:00:09.96', 'End Timecode': '00:00:10.05', Speaker: 'Speaker1' },
	{ Word: 'doing.', 'Start Timecode': '00:00:10.05', 'End Timecode': '00:00:10.65', Speaker: 'Speaker1' },
	{ Word: 'This', 'Start Timecode': '00:00:11.07', 'End Timecode': '00:00:11.43', Speaker: 'Speaker1' },
	{ Word: 'risk', 'Start Timecode': '00:00:11.43', 'End Timecode': '00:00:11.73', Speaker: 'Speaker1' },
	{ Word: 'assessment', 'Start Timecode': '00:00:11.73', 'End Timecode': '00:00:12.18', Speaker: 'Speaker1' },
	{ Word: 'in', 'Start Timecode': '00:00:12.18', 'End Timecode': '00:00:12.36', Speaker: 'Speaker1' },
	{ Word: 'general', 'Start Timecode': '00:00:12.36', 'End Timecode': '00:00:12.99', Speaker: 'Speaker1' },
	{ Word: 'and', 'Start Timecode': '00:00:12.99', 'End Timecode': '00:00:13.38', Speaker: 'Speaker1' },
	{ Word: 'the', 'Start Timecode': '00:00:13.38', 'End Timecode': '00:00:13.53', Speaker: 'Speaker1' },
	{ Word: 'electrical', 'Start Timecode': '00:00:13.53', 'End Timecode': '00:00:14.04', Speaker: 'Speaker1' },
	{ Word: 'risk', 'Start Timecode': '00:00:14.04', 'End Timecode': '00:00:14.34', Speaker: 'Speaker1' },
	{ Word: 'in', 'Start Timecode': '00:00:14.34', 'End Timecode': '00:00:14.43', Speaker: 'Speaker1' },
	{ Word: 'particular', 'Start Timecode': '00:00:14.43', 'End Timecode': '00:00:15.21', Speaker: 'Speaker1' },
	{ Word: 'is', 'Start Timecode': '00:00:15.21', 'End Timecode': '00:00:15.48', Speaker: 'Speaker1' },
	{ Word: 'mandatory.', 'Start Timecode': '00:00:15.48', 'End Timecode': '00:00:16.32', Speaker: 'Speaker1' },
	{ Word: "Let's", 'Start Timecode': '00:00:16.41', 'End Timecode': '00:00:16.77', Speaker: 'Speaker1' },
	{ Word: 'have', 'Start Timecode': '00:00:16.77', 'End Timecode': '00:00:16.89', Speaker: 'Speaker1' },
	{ Word: 'a', 'Start Timecode': '00:00:16.89', 'End Timecode': '00:00:16.98', Speaker: 'Speaker1' },
	{ Word: 'look', 'Start Timecode': '00:00:16.98', 'End Timecode': '00:00:17.13', Speaker: 'Speaker1' },
	{ Word: 'at', 'Start Timecode': '00:00:17.13', 'End Timecode': '00:00:17.28', Speaker: 'Speaker1' },
	{ Word: 'it.', 'Start Timecode': '00:00:17.28', 'End Timecode': '00:00:17.58', Speaker: 'Speaker1' },
];

export const wordsMainEN: Eventime[] = wordsCuesEN.map((cue) => {
	const content = cue['Word'];
	const startAt = timecodeToDuration(cue['Start Timecode']);
	const end = timecodeToDuration(cue['End Timecode']);
	const duration = end - startAt;
	return { startAt, name: 'text', channel: MAIN, data: { duration, content } };
});

export const wordsEventsThreeEN: Eventime[] = wordsCuesEN.map((cue) => {
	const content = cue['Word'];
	const startAt = timecodeToDuration(cue['Start Timecode']);
	const end = timecodeToDuration(cue['End Timecode']);
	const duration = end - startAt;
	const name = content.toLowerCase();
	return {
		startAt,
		name,
		channel: THR3D,
		data: { duration, content },
	};
});

// console.log(wordsEventsThree);

function timecodeToDuration(tc) {
	const time = tc.split(':');
	const hours = parseInt(time[0]) * 60 * 60;
	const minutes = parseInt(time[1]) * 60;
	const seconds = Number(time[2]);
	return Math.round((hours + minutes + seconds) * 1000);
}
