import { END_SEQUENCE, PLAY } from '../common/constants';
import type { CbStatus } from '../clock';
import type { Telco } from './demo13';

interface ControlProps {
	duration: number;
	trackName: string;
}

//SLIDER////////////
export function createTelco(telco: Telco, { duration, trackName }: ControlProps) {
	const command = document.createElement('div');
	command.id = 'telco';
	const slider = document.createElement('input');
	slider.setAttribute('type', 'range');
	slider.setAttribute('min', '0');
	slider.setAttribute('max', '100');
	slider.setAttribute('step', '1');
	slider.addEventListener('mousedown', () => {
		slider.addEventListener('mousemove', mousemove);
	});
	slider.addEventListener('mouseup', () => {
		slider.removeEventListener('mousemove', mousemove);
	});
	slider.addEventListener('click', mousemove);

	function mousemove(): void {
		const p = (Number(slider.value) * duration) / 100 - 100;
		const progression = p > 0 ? p : 0;
		progress.textContent = Math.round(Number(slider.value)) + '%';
		telco.seek(progression, trackName);
	}

	let toggle = true;
	function togglePlay(): void {
		if (toggle) {
			telco.pause();
			playButton.innerText = 'play';
			toggle = false;
		} else {
			telco.play();
			playButton.innerText = 'pause';
			toggle = true;
		}
	}
	const playButton = document.createElement('button');
	playButton.innerText = 'pause';
	playButton.addEventListener('click', togglePlay);

	const progress = document.createElement('span');

	command.appendChild(playButton);
	command.appendChild(slider);
	command.appendChild(progress);
	document.body.appendChild(command);

	telco.onTick((status: CbStatus) => {
		if (status.trackName !== trackName) return;

		if (status.statement === PLAY) {
			const p = Math.min(status.currentTime, duration);
			const progression = (p * 100) / duration;
			slider.value = String(progression);
			progress.textContent = Math.round(p) + 'ms';
			// progress.textContent = Math.round(progression) + '%';
		}
	});
}
