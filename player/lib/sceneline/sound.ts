import { PersoSoundDef } from '~/main';

export class Sound {
	store = new Map<string, PersoSoundDef>();

	update;
}

/* 
store stocke les sons,
update prend les events entrants :
- start
- stop
- pause ?
- seek
- options : 
  - fade
  - volume

tick pour suivre les décalages de tempo

*/
