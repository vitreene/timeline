export function createTelco(telco, duration = 100) {
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
		progress.textContent = Math.round(progression) + 'ms';
		telco.seek(progression);
		playButton.innerText = 'play';
		toggle = false;
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
	// let elapsed = 0;
	function onTick({ delta, options }) {
		if (options.time > duration) telco.pause();
		const elapsed = options.time;
		// elapsed += delta;
		const p = Math.min(elapsed, duration);
		const progression = (p * 100) / duration;
		slider.value = String(progression);
		progress.textContent = Math.round(p) + 'ms';
	}
	telco.addToTimer(onTick);
	const playButton = document.createElement('button');
	playButton.innerText = 'pause';
	playButton.addEventListener('click', togglePlay);

	const progress = document.createElement('span');
	command.appendChild(playButton);
	command.appendChild(slider);
	command.appendChild(progress);
	const container = document.getElementById('container');
	container.appendChild(command);
}

/* FIXME
- le 2e compteur ne s'arrete pas 
*/
