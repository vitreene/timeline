import { Timeline } from '../tracks/timeline';
import { SEEK, TRACK_PAUSE, TRACK_PLAY, TRACK_ENGLISH } from '../common/constants';

import type { Cb } from '../clock';
import type { TrackName } from '../tracks';

const timerOnEnter = {
	[TRACK_PLAY]: TRACK_ENGLISH,
	[TRACK_ENGLISH]: TRACK_PLAY,
	[TRACK_PAUSE]: null,
};

type Time = number;

export class Telco {
	timeline: Timeline;
	_list = [TRACK_PLAY, TRACK_PAUSE, TRACK_ENGLISH];
	_active = new Set<string>();
	_inactive = new Set<string>();

	constructor(props) {
		this.timeline = new Timeline(props);
		this.toggleActive = this.toggleActive.bind(this);
		this._active.add(TRACK_PLAY);
		// this._inactive.add(TRACK_PAUSE);
		this._inactive.add(TRACK_ENGLISH);
	}
	start() {
		this.play();
		this.timeline.tracks.clock.start();
	}
	play() {
		const action = {
			active: Array.from(this._active),
			inactive: [TRACK_PAUSE, ...Array.from(this._inactive)],
			timer: timerOnEnter,
		};
		console.log('PLAY->', action);
		this.timeline.tracks.control('play', action);
	}

	pause() {
		const action = {
			active: [TRACK_PAUSE],
			inactive: [TRACK_ENGLISH, TRACK_PLAY], //TODO  others
			timer: timerOnEnter,
		};
		console.log('PAUSE->', action);
		this.timeline.tracks.control('pause', action);
	}

	seek(progress: Time, trackName: TrackName) {
		this.timeline.tracks.clock[SEEK](trackName, progress);
	}

	onTick(fn: Cb) {
		this.timeline.tracks.clock.onTick(fn);
	}

	toggleActive() {
		if (this._active.has(TRACK_PLAY)) {
			this._active.delete(TRACK_PLAY);
			this._active.add(TRACK_ENGLISH);
			this._inactive.add(TRACK_PLAY);
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
