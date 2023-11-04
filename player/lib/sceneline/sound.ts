import { PersoAction, PersoSoundDef, SoundAction } from '~/main';

export class Sound {
	store = new Map<string, PersoSoundDef>();

	update(id: string, action: SoundAction) {
		console.log('SOUND', id, action);
	}

	sync(delta: number) {}
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

:{action:"start"|"stop"})
*/
