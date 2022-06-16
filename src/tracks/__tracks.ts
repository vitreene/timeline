import { CbStatus } from '../clock';
import { Eventime } from '../types';
import { PAUSE, PLAY, SEEK } from '../common/constants';

type Run = (status: CbStatus) => void;

type EventChannel = Map<number, Set<string>>;
type EventData = Map<number, Map<number, any>>;
type CasualEvent = [string, Eventime];

interface TrackOptions {
	onActive: () => void;
	onDesactive: () => void;
}

interface TrackState {
	refStatus: string;
	name: string;
	times: number[];
	data: Map<string, EventData>;
	events: Map<string, EventChannel>;
	nextEvent: Map<number, CasualEvent[]>;
}

export class TracksComponent {
	runs: Run[];
	activeGroupTrack: string;
	status: { [groupName: string]: CbStatus };
	trackEvents: { [groupName: string]: TrackState };

	constructor(...args: Run[]) {
		this.runs = args;
		this.run = this.run.bind(this);
	}
	run(status: CbStatus) {
		this.runs.forEach((run) => {
			// TODO modifier status en fonction de la configuration courante
			run(status);
		});
	}

	addEventToTrack(track: string, event: Eventime) {}

	defineTrack(name: string, options: TrackOptions) {}
	defineGroupTrack(options: TrackOptions) {}
	swapStateTrack(groupTrack: string) {}
}

export class Tracks extends TracksComponent {
	start(initial = 0) {
		this[PLAY]();
	}
	[PLAY]() {}
	[PAUSE]() {}

	[SEEK](time: number) {}
}
/* 

- addEventToTrack( track, event)
- defineTrack(name, options)
  - options{
    onActive,
    onInactive
  }
- defineGroupTrack(options)
  - options{
  name
  group: track[]
  refstatus
  statusOnActive : reset | current
}
- swapStateTrack(groupTrack)

 

datas
- status :{[ groupName ] : Status}
- activeGroupTrack

interface
- play() 
- pause()
*/
