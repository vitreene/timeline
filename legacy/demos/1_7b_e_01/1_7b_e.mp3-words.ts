import { MAIN, THR3D } from '../../../player/src/common/constants';
import { Eventime } from '../../../player/src/types';

const wordsCues = [
	{
		Word: 'Vous',
		'Start Timecode': '00:00:00.18',
		'End Timecode': '00:00:00.33',
		Speaker: 'Speaker1',
	},
	{
		Word: "l'avez",
		'Start Timecode': '00:00:00.33',
		'End Timecode': '00:00:00.57',
		Speaker: 'Speaker1',
	},
	{
		Word: 'donc',
		'Start Timecode': '00:00:00.57',
		'End Timecode': '00:00:00.81',
		Speaker: 'Speaker1',
	},
	{
		Word: 'vu,',
		'Start Timecode': '00:00:00.81',
		'End Timecode': '00:00:01.20',
		Speaker: 'Speaker1',
	},
	{
		Word: "l'électricité",
		'Start Timecode': '00:00:01.20',
		'End Timecode': '00:00:01.89',
		Speaker: 'Speaker1',
	},
	{
		Word: 'présente',
		'Start Timecode': '00:00:01.89',
		'End Timecode': '00:00:02.34',
		Speaker: 'Speaker1',
	},
	{
		Word: 'des',
		'Start Timecode': '00:00:02.34',
		'End Timecode': '00:00:02.49',
		Speaker: 'Speaker1',
	},
	{
		Word: 'risques.',
		'Start Timecode': '00:00:02.49',
		'End Timecode': '00:00:03.00',
		Speaker: 'Speaker1',
	},
	{
		Word: 'Si',
		'Start Timecode': '00:00:03.39',
		'End Timecode': '00:00:03.63',
		Speaker: 'Speaker1',
	},
	{
		Word: 'nous',
		'Start Timecode': '00:00:03.63',
		'End Timecode': '00:00:03.81',
		Speaker: 'Speaker1',
	},
	{
		Word: 'connaissons',
		'Start Timecode': '00:00:03.81',
		'End Timecode': '00:00:04.29',
		Speaker: 'Speaker1',
	},
	{
		Word: 'ces',
		'Start Timecode': '00:00:04.29',
		'End Timecode': '00:00:04.44',
		Speaker: 'Speaker1',
	},
	{
		Word: 'risques,',
		'Start Timecode': '00:00:04.44',
		'End Timecode': '00:00:04.89',
		Speaker: 'Speaker1',
	},
	{
		Word: 'nous',
		'Start Timecode': '00:00:04.89',
		'End Timecode': '00:00:05.10',
		Speaker: 'Speaker1',
	},
	{
		Word: 'pouvons',
		'Start Timecode': '00:00:05.10',
		'End Timecode': '00:00:05.40',
		Speaker: 'Speaker1',
	},
	{
		Word: 'les',
		'Start Timecode': '00:00:05.40',
		'End Timecode': '00:00:05.49',
		Speaker: 'Speaker1',
	},
	{
		Word: 'prévenir.',
		'Start Timecode': '00:00:05.49',
		'End Timecode': '00:00:06.12',
		Speaker: 'Speaker1',
	},
	{
		Word: "C'est",
		'Start Timecode': '00:00:06.48',
		'End Timecode': '00:00:06.66',
		Speaker: 'Speaker1',
	},
	{
		Word: 'pourquoi',
		'Start Timecode': '00:00:06.66',
		'End Timecode': '00:00:06.96',
		Speaker: 'Speaker1',
	},
	{
		Word: 'il',
		'Start Timecode': '00:00:06.96',
		'End Timecode': '00:00:07.08',
		Speaker: 'Speaker1',
	},
	{
		Word: 'est',
		'Start Timecode': '00:00:07.08',
		'End Timecode': '00:00:07.20',
		Speaker: 'Speaker1',
	},
	{
		Word: 'essentiel',
		'Start Timecode': '00:00:07.20',
		'End Timecode': '00:00:07.74',
		Speaker: 'Speaker1',
	},
	{
		Word: "d'évaluer",
		'Start Timecode': '00:00:07.74',
		'End Timecode': '00:00:08.19',
		Speaker: 'Speaker1',
	},
	{
		Word: 'le',
		'Start Timecode': '00:00:08.19',
		'End Timecode': '00:00:08.31',
		Speaker: 'Speaker1',
	},
	{
		Word: 'risque',
		'Start Timecode': '00:00:08.31',
		'End Timecode': '00:00:08.61',
		Speaker: 'Speaker1',
	},
	{
		Word: 'électrique',
		'Start Timecode': '00:00:08.61',
		'End Timecode': '00:00:09.06',
		Speaker: 'Speaker1',
	},
	{
		Word: 'dans',
		'Start Timecode': '00:00:09.06',
		'End Timecode': '00:00:09.21',
		Speaker: 'Speaker1',
	},
	{
		Word: 'le',
		'Start Timecode': '00:00:09.21',
		'End Timecode': '00:00:09.30',
		Speaker: 'Speaker1',
	},
	{
		Word: 'travail',
		'Start Timecode': '00:00:09.30',
		'End Timecode': '00:00:09.69',
		Speaker: 'Speaker1',
	},
	{
		Word: 'que',
		'Start Timecode': '00:00:09.69',
		'End Timecode': '00:00:09.87',
		Speaker: 'Speaker1',
	},
	{
		Word: 'vous',
		'Start Timecode': '00:00:09.87',
		'End Timecode': '00:00:10.02',
		Speaker: 'Speaker1',
	},
	{
		Word: 'effectuez.',
		'Start Timecode': '00:00:10.02',
		'End Timecode': '00:00:10.68',
		Speaker: 'Speaker1',
	},
	{
		Word: 'Cette',
		'Start Timecode': '00:00:11.22',
		'End Timecode': '00:00:11.52',
		Speaker: 'Speaker1',
	},
	{
		Word: 'évaluation',
		'Start Timecode': '00:00:11.52',
		'End Timecode': '00:00:12.03',
		Speaker: 'Speaker1',
	},
	{
		Word: 'des',
		'Start Timecode': '00:00:12.03',
		'End Timecode': '00:00:12.15',
		Speaker: 'Speaker1',
	},
	{
		Word: 'risques',
		'Start Timecode': '00:00:12.15',
		'End Timecode': '00:00:12.45',
		Speaker: 'Speaker1',
	},
	{
		Word: 'en',
		'Start Timecode': '00:00:12.45',
		'End Timecode': '00:00:12.54',
		Speaker: 'Speaker1',
	},
	{
		Word: 'général',
		'Start Timecode': '00:00:12.54',
		'End Timecode': '00:00:13.17',
		Speaker: 'Speaker1',
	},
	{
		Word: 'et',
		'Start Timecode': '00:00:13.17',
		'End Timecode': '00:00:13.32',
		Speaker: 'Speaker1',
	},
	{
		Word: 'du',
		'Start Timecode': '00:00:13.32',
		'End Timecode': '00:00:13.44',
		Speaker: 'Speaker1',
	},
	{
		Word: 'risque',
		'Start Timecode': '00:00:13.44',
		'End Timecode': '00:00:13.74',
		Speaker: 'Speaker1',
	},
	{
		Word: 'électrique',
		'Start Timecode': '00:00:13.74',
		'End Timecode': '00:00:14.19',
		Speaker: 'Speaker1',
	},
	{
		Word: 'en',
		'Start Timecode': '00:00:14.19',
		'End Timecode': '00:00:14.28',
		Speaker: 'Speaker1',
	},
	{
		Word: 'particulier',
		'Start Timecode': '00:00:14.28',
		'End Timecode': '00:00:15.09',
		Speaker: 'Speaker1',
	},
	{
		Word: 'est',
		'Start Timecode': '00:00:15.09',
		'End Timecode': '00:00:15.33',
		Speaker: 'Speaker1',
	},
	{
		Word: 'obligatoire.',
		'Start Timecode': '00:00:15.33',
		'End Timecode': '00:00:16.17',
		Speaker: 'Speaker1',
	},
	{
		Word: 'Nous',
		'Start Timecode': '00:00:16.56',
		'End Timecode': '00:00:16.80',
		Speaker: 'Speaker1',
	},
	{
		Word: 'allons',
		'Start Timecode': '00:00:16.80',
		'End Timecode': '00:00:17.01',
		Speaker: 'Speaker1',
	},
	{
		Word: 'en',
		'Start Timecode': '00:00:17.01',
		'End Timecode': '00:00:17.07',
		Speaker: 'Speaker1',
	},
	{
		Word: 'parler.',
		'Start Timecode': '00:00:17.07',
		'End Timecode': '00:00:18',
		Speaker: 'Speaker1',
	},
	{
		Word: '–',
		'Start Timecode': '00:00:18',
		'End Timecode': '00:00:19',
		Speaker: 'Speaker1',
	},
];

export const wordsMain: Eventime[] = wordsCues.map((cue) => {
	const content = cue['Word'];
	const startAt = timecodeToDuration(cue['Start Timecode']);
	const end = timecodeToDuration(cue['End Timecode']);
	const duration = end - startAt;
	return { startAt, name: 'text', channel: MAIN, data: { duration, content } };
});

export const wordsEventsThree: Eventime[] = wordsCues.map((cue) => {
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
