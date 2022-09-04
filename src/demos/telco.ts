import { Timeline } from '../tracks/timeline';
import { SEEK, TRACK_PAUSE, TRACK_PLAY } from '../common/constants';

import type { Cb } from '../clock';
import type { TrackName } from '../tracks';

const TRACK_ENGLISH = 'trackEnglish';

type Time = number;

export class Telco extends Timeline {
	start() {
		this.play();
		this.tracks.clock.start();
	}
	play() {
		const action = {
			active: [TRACK_PLAY, TRACK_ENGLISH],
			inactive: [TRACK_PAUSE],
		};
		this.tracks.control('play', action);
	}

	pause() {
		const action = {
			active: [TRACK_PAUSE],
			inactive: [TRACK_PLAY, TRACK_ENGLISH], //TODO  others
		};
		this.tracks.control('pause', action);
	}

	seek(progress: Time, trackName: TrackName) {
		this.tracks.clock[SEEK](trackName, progress);
	}

	onTick(fn: Cb) {
		this.tracks.clock.onTick(fn);
	}
}
