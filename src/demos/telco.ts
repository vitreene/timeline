import { Clock } from '../timeline';

import { END_SEQUENCE } from '../common/constants';

//SLIDER////////////
export function createTelco() {
	const telco = document.createElement('div');
	telco.id = 'telco';
	const slider = document.createElement('input');
	slider.setAttribute('type', 'range');
	slider.addEventListener('mousedown', () => {
		slider.addEventListener('mousemove', mousemove);
	});
	slider.addEventListener('mouseup', () => {
		slider.removeEventListener('mousemove', mousemove);
	});
	function mousemove(e: Event): void {
		const el = e.target as HTMLInputElement;
		const p = (Number(el.value) * END_SEQUENCE) / 100 - 100;
		const progression = p > 0 ? p : 0;
		progress.textContent = String(progression);
		Clock.seek(progression);
	}
	const playButton = document.createElement('button');
	playButton.innerText = 'play';
	playButton.addEventListener('click', () => Clock.play());
	const pauseButton = document.createElement('button');
	pauseButton.innerText = 'pause';
	pauseButton.addEventListener('click', () => Clock.pause());

	const progress = document.createElement('span');

	telco.appendChild(playButton);
	telco.appendChild(slider);
	telco.appendChild(pauseButton);
	telco.appendChild(progress);
	document.body.appendChild(telco);
}
