import { MAIN, THR3D } from '../../common/constants';
import { Eventime } from '../../types';

const wordsCuesES = [
	{ Word: 'Como', 'Start Timecode': '00:00:00.18', 'End Timecode': '00:00:00.48', Speaker: 'Speaker1' },
	{ Word: 'ha', 'Start Timecode': '00:00:00.48', 'End Timecode': '00:00:00.54', Speaker: 'Speaker1' },
	{ Word: 'visto,', 'Start Timecode': '00:00:00.54', 'End Timecode': '00:00:00.99', Speaker: 'Speaker1' },
	{ Word: 'la', 'Start Timecode': '00:00:00.99', 'End Timecode': '00:00:01.23', Speaker: 'Speaker1' },
	{ Word: 'electricidad', 'Start Timecode': '00:00:01.23', 'End Timecode': '00:00:01.92', Speaker: 'Speaker1' },
	{ Word: 'implica', 'Start Timecode': '00:00:01.92', 'End Timecode': '00:00:02.34', Speaker: 'Speaker1' },
	{ Word: 'riesgos.', 'Start Timecode': '00:00:02.34', 'End Timecode': '00:00:03.03', Speaker: 'Speaker1' },
	{ Word: 'Si', 'Start Timecode': '00:00:03.12', 'End Timecode': '00:00:03.36', Speaker: 'Speaker1' },
	{ Word: 'conocemos', 'Start Timecode': '00:00:03.36', 'End Timecode': '00:00:03.90', Speaker: 'Speaker1' },
	{ Word: 'estos', 'Start Timecode': '00:00:03.90', 'End Timecode': '00:00:04.26', Speaker: 'Speaker1' },
	{ Word: 'riesgos,', 'Start Timecode': '00:00:04.38', 'End Timecode': '00:00:04.89', Speaker: 'Speaker1' },
	{ Word: 'podemos', 'Start Timecode': '00:00:04.89', 'End Timecode': '00:00:05.37', Speaker: 'Speaker1' },
	{ Word: 'prevenirlos.', 'Start Timecode': '00:00:05.37', 'End Timecode': '00:00:06.18', Speaker: 'Speaker1' },
	{ Word: 'Por', 'Start Timecode': '00:00:06.48', 'End Timecode': '00:00:06.72', Speaker: 'Speaker1' },
	{ Word: 'lo', 'Start Timecode': '00:00:06.72', 'End Timecode': '00:00:06.81', Speaker: 'Speaker1' },
	{ Word: 'tanto,', 'Start Timecode': '00:00:06.81', 'End Timecode': '00:00:07.29', Speaker: 'Speaker1' },
	{ Word: 'es', 'Start Timecode': '00:00:07.29', 'End Timecode': '00:00:07.50', Speaker: 'Speaker1' },
	{ Word: 'esencial', 'Start Timecode': '00:00:07.50', 'End Timecode': '00:00:07.98', Speaker: 'Speaker1' },
	{ Word: 'evaluar', 'Start Timecode': '00:00:07.98', 'End Timecode': '00:00:08.40', Speaker: 'Speaker1' },
	{ Word: 'el', 'Start Timecode': '00:00:08.40', 'End Timecode': '00:00:08.52', Speaker: 'Speaker1' },
	{ Word: 'riesgo', 'Start Timecode': '00:00:08.52', 'End Timecode': '00:00:09.00', Speaker: 'Speaker1' },
	{ Word: 'eléctrico', 'Start Timecode': '00:00:09.00', 'End Timecode': '00:00:09.54', Speaker: 'Speaker1' },
	{ Word: 'en', 'Start Timecode': '00:00:09.54', 'End Timecode': '00:00:09.69', Speaker: 'Speaker1' },
	{ Word: 'el', 'Start Timecode': '00:00:09.69', 'End Timecode': '00:00:09.78', Speaker: 'Speaker1' },
	{ Word: 'trabajo', 'Start Timecode': '00:00:09.78', 'End Timecode': '00:00:10.26', Speaker: 'Speaker1' },
	{ Word: 'que', 'Start Timecode': '00:00:10.26', 'End Timecode': '00:00:10.41', Speaker: 'Speaker1' },
	{ Word: 'está', 'Start Timecode': '00:00:10.41', 'End Timecode': '00:00:10.68', Speaker: 'Speaker1' },
	{ Word: 'realizando.', 'Start Timecode': '00:00:10.68', 'End Timecode': '00:00:11.49', Speaker: 'Speaker1' },
	{ Word: 'Esta', 'Start Timecode': '00:00:11.70', 'End Timecode': '00:00:12.09', Speaker: 'Speaker1' },
	{ Word: 'evaluación', 'Start Timecode': '00:00:12.09', 'End Timecode': '00:00:12.69', Speaker: 'Speaker1' },
	{ Word: 'del', 'Start Timecode': '00:00:12.69', 'End Timecode': '00:00:12.87', Speaker: 'Speaker1' },
	{ Word: 'riesgo', 'Start Timecode': '00:00:12.87', 'End Timecode': '00:00:13.29', Speaker: 'Speaker1' },
	{ Word: 'en', 'Start Timecode': '00:00:13.29', 'End Timecode': '00:00:13.47', Speaker: 'Speaker1' },
	{ Word: 'general', 'Start Timecode': '00:00:13.47', 'End Timecode': '00:00:14.04', Speaker: 'Speaker1' },
	{ Word: 'y', 'Start Timecode': '00:00:14.04', 'End Timecode': '00:00:14.19', Speaker: 'Speaker1' },
	{ Word: 'del', 'Start Timecode': '00:00:14.19', 'End Timecode': '00:00:14.34', Speaker: 'Speaker1' },
	{ Word: 'riesgo', 'Start Timecode': '00:00:14.34', 'End Timecode': '00:00:14.70', Speaker: 'Speaker1' },
	{ Word: 'eléctrico', 'Start Timecode': '00:00:14.70', 'End Timecode': '00:00:15.27', Speaker: 'Speaker1' },
	{ Word: 'en', 'Start Timecode': '00:00:15.27', 'End Timecode': '00:00:15.45', Speaker: 'Speaker1' },
	{ Word: 'particular', 'Start Timecode': '00:00:15.45', 'End Timecode': '00:00:16.22', Speaker: 'Speaker1' },
	{ Word: 'es', 'Start Timecode': '00:00:16.23', 'End Timecode': '00:00:16.47', Speaker: 'Speaker1' },
	{ Word: 'obligatoria.', 'Start Timecode': '00:00:16.47', 'End Timecode': '00:00:17.28', Speaker: 'Speaker1' },
	{ Word: 'Hablaremos', 'Start Timecode': '00:00:17.52', 'End Timecode': '00:00:18.18', Speaker: 'Speaker1' },
	{ Word: 'de', 'Start Timecode': '00:00:18.18', 'End Timecode': '00:00:18.33', Speaker: 'Speaker1' },
	{ Word: 'ello.', 'Start Timecode': '00:00:18.33', 'End Timecode': '00:00:18.72', Speaker: 'Speaker1' },
];

export const wordsMainES: Eventime[] = wordsCuesES.map((cue) => {
	const content = cue['Word'];
	const startAt = timecodeToDuration(cue['Start Timecode']);
	const end = timecodeToDuration(cue['End Timecode']);
	const duration = end - startAt;
	return { startAt, name: 'text', channel: MAIN, data: { duration, content } };
});

export const wordsEventsThreeES: Eventime[] = wordsCuesES.map((cue) => {
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
