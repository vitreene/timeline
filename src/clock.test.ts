import { Timer } from './clock';

import { it, describe, expect, assert } from 'vitest';

const AC = {
	_secondes: 0.1,
	get currentTime() {
		const t = this._secondes;
		this._secondes += 1;
		console.log('currentTime', t);

		return t;
	},
};

describe('Timer starts', () => {
	const clock = new Timer({ endsAt: 4000, audioContext: AC });
	clock.subscribe((time) => console.log('subscribe', time));

	clock.start(0);
	it('play', () => {
		expect(clock.isPlaying).toBeTruthy();
	});
});
