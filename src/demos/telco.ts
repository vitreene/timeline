import { Timeline } from '../tracks/timeline';
import { SEEK, TRACK_PAUSE, TRACK_PLAY, TRACK_ENGLISH } from '../common/constants';

import type { Cb } from '../clock';
import type { TrackName } from '../tracks';

type Time = number;

export class Telco extends Timeline {
	_list = [TRACK_PLAY, TRACK_PAUSE, TRACK_ENGLISH];
	_active = new Set<string>();
	_inactive = new Set<string>();

	constructor(props) {
		super(props);
		this.toggleActive = this.toggleActive.bind(this);
		this._active.add(TRACK_PLAY);
		// this._inactive.add(TRACK_PAUSE);
		this._inactive.add(TRACK_ENGLISH);
	}
	start() {
		this.play();
		this.tracks.clock.start();
	}
	play() {
		const action = {
			active: Array.from(this._active),
			inactive: [TRACK_PAUSE, ...Array.from(this._inactive)],
		};
		console.log('PLAY->', action);
		this.tracks.control('play', action);
	}

	pause() {
		const action = {
			active: [TRACK_PAUSE],
			inactive: [TRACK_ENGLISH, TRACK_PLAY], //TODO  others
		};
		console.log('PAUSE->', action);
		this.tracks.control('pause', action);
	}

	seek(progress: Time, trackName: TrackName) {
		this.tracks.clock[SEEK](trackName, progress);
	}

	onTick(fn: Cb) {
		this.tracks.clock.onTick(fn);
	}

	toggleActive() {
		// this.pause();
		if (this._active.has(TRACK_PLAY)) {
			this._active.delete(TRACK_PLAY);
			this._inactive.add(TRACK_PLAY);
			this._active.add(TRACK_ENGLISH);
			this._inactive.delete(TRACK_ENGLISH);
		} else {
			this._active.delete(TRACK_ENGLISH);
			this._active.add(TRACK_PLAY);
			this._inactive.add(TRACK_ENGLISH);
			this._inactive.delete(TRACK_PLAY);
		}

		console.log('toggleActive->', this._active);

		this.play();
	}
}
