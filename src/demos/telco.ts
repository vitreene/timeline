// import { Clock } from '../tracks/timeline';

import { END_SEQUENCE, PLAY } from '../common/constants';
import { CbStatus } from 'src/clock';

//SLIDER////////////
export function createTelco(commande) {
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

	function mousemove(): void {
		const p = (Number(slider.value) * END_SEQUENCE) / 100 - 100;
		const progression = p > 0 ? p : 0;
		progress.textContent = Math.round(Number(slider.value)) + '%';

		commande.seek(progression);
	}

	let toggle = true;
	function togglePlay(): void {
		if (toggle) {
			commande.pause();
			playButton.innerText = 'play';
			toggle = false;
		} else {
			commande.play();
			playButton.innerText = 'pause';
			toggle = true;
		}
	}
	const playButton = document.createElement('button');
	playButton.innerText = 'pause';
	playButton.addEventListener('click', togglePlay);

	const progress = document.createElement('span');

	telco.appendChild(playButton);
	telco.appendChild(slider);
	telco.appendChild(progress);
	document.body.appendChild(telco);

	commande.onTick((status: CbStatus) => {
		if (status.action === PLAY) {
			const progression = (status.currentTime * 100) / END_SEQUENCE;
			slider.value = String(progression);
			progress.textContent = Math.round(status.currentTime) + 'ms';
			// progress.textContent = Math.round(progression) + '%';
		}
	});
}
