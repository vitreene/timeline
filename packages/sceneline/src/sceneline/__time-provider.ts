/* 
créer une alternative au timer basé sur raf.
celui-ci permet de coordonner précisement les time de l'animation et d'un média.
inconvénient, il ne peut s'exécuter que dans un contexte d'action utilisateur. 
c'est pourquoi il faut tester si l'animation possède des média à jouer, auquel cas une action utilisateur sera de tout facon nécessaire. 

difficulté : créer ine interface identique 

*/
import { Store } from './store';
import type { TimerCallback } from '../types';

const msg = document.querySelector('#message');

const TIME_LEAP = 10;
const videoref = 'timer-provider';

export class TimeProvider {
	handlers = new Store<TimerCallback>();
	time = 0;
	elapsed = 0;

	seek(time: number) {
		this.time = time;
		this.elapsed = time;
	}

	cue: VTTCue;
	video: HTMLVideoElement;
	track: HTMLTrackElement;

	constructor() {
		this.init();
	}

	init() {
		this.video = document.querySelector(`#${videoref}`);
		if (!this.video) {
			this.video = document.createElement('video');

			this.video.id = videoref;
			this.video.controls = true;
			this.video.volume = 0;

			// this.track = document.createElement('track');
			// this.track.id = 'timer-track';
			// this.track.setAttribute('default', 'true');
			// this.track.src = emptyBlob();

			// this.track.setAttribute('kind', 'captions');
			// this.track.setAttribute('srclang', 'en');
			// this.track.setAttribute('mode', 'showing');

			// console.log('timer-track-->', this.track);

			// this.video.appendChild(this.track);
			document.body.appendChild(this.video);

			// video.loop = true;
		}

		//
		// video.setAttribute("hidden", "true");
		// video.muted = true;
		//

		//
		// setTimeout(() => video.pause(), 10000);
		//
	}

	start = () => {
		const audioContext = new AudioContext();
		console.log('****TimeProvider init');

		const oscillator = audioContext.createOscillator();
		const streamNode = audioContext.createMediaStreamDestination();
		oscillator.connect(streamNode);
		oscillator.start();
		this.video.srcObject = streamNode.stream;

		this.video.oncanplaythrough = () => {
			this.cueTimer(this.video);
			this.video.play();
		};

		console.log('this.handlers', this.handlers);
	};

	cueTimer(video: HTMLVideoElement) {
		let count = 0;
		// fréquence chaque 1/10e seconde
		// valeur en ms
		this.time = 0;
		const track = video.addTextTrack('metadata', 'meta', 'en');
		track.mode = 'hidden';

		this.cue = new VTTCue(0, 0, String(this.time));
		track.addCue(this.cue);
		console.log('first cue :', this.cue);
		setTimeout(() => {}, 0);
		// for (let i = 0; i < 50; i++) {
		// 	const t = (i * 100 + 5) * 0.001;
		// 	const cue = new VTTCue(t, t, `frame_${i}`);

		// 	track.addCue(cue);
		// }

		const onChange = async () => {
			// console.log('TRACK', track, this.cue);
			count++;
			setTimeout(() => {}, 0);
			this.cue && track.removeCue(this.cue);
			const t = this.time * 0.001;
			this.cue = new VTTCue(t, 0, String(this.time));

			track.addCue(this.cue);
			// console.log(count, this.cue);

			this.handlers.update({ delta: TIME_LEAP, options: { time: this.time } });
			//
			msg.textContent = String(this.time);
			//

			// console.log({ delta: TIME_LEAP, options: { time: this.time } });

			// console.log(
			// 	`CUETIMER |-->'  time : ${Math.round(video.currentTime * 1000)}, timer : ${Math.round(this.time * 1000) / 1000}, diff : ${Math.abs((video.currentTime - this.time) * 1000) / 1000}`
			// );
			// debugger;
			this.time += TIME_LEAP;
		};

		track.addEventListener('cuechange', onChange);
		// cet appel declenche l'animation, et active le onchange sur l'audio.
		// par contre rien ensuite pour ce onchange
		onChange();

		return () => track.removeEventListener('cuechange', onChange);
	}
}

function emptyBlob() {
	const b = new Blob(
		[
			`
  1
00:00:02.500 --> 00:00:05.000
NARRATOR: TEST CAPTION HERE,

2
00:00:08.000 --> 00:00:18.000
TEST CAPTION HERE.
`,
		],
		{ type: 'text/vtt' }
	);
	const u = URL.createObjectURL(b);
	return u;
}
/* 
start.onclick = e => {

  const audioCtx = new AudioContext();
  fetch("https://dl.dropboxusercontent.com/s/1cdwpm3gca9mlo0/kick.mp3")
  .then(resp => resp.arrayBuffer())
  .then(buf => audioCtx.decodeAudioData(buf))
  .then(audioBuffer => {
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = 0.1;
    source.loop = true;
    source.start(0);
    const streamNode = audioCtx.createMediaStreamDestination();
    source.connect(streamNode);
    const audioElem = new Audio();
    audioElem.controls = true;
    document.body.appendChild(audioElem);
    audioElem.srcObject = streamNode.stream;
  })
  .catch(console.error);
}
*/

/* 
var last = Date.now();
requestAnimationFrame(function tick() {
    if (Date.now() - last >= 92) { // Why 92 instead of 100? See ¹ below.
        doYourWorkHere();

        last = Date.now();
    }
    requestAnimationFrame(tick);
});
*/
