import { ChannelName } from '../../types';
import { Channel, RunEvent } from './channel';
import { CbStatus } from '../clock';
import { StorePersoItems } from 'src/legacy/render/create-perso';

export class ThreeChannel extends Channel {
	store: StorePersoItems;
	name = ChannelName.THR3D;
	callback: Record<string, Array<(event: RunEvent) => void>> = {};

	constructor(props) {
		super(props);
		this.onTick = this.onTick.bind(this);
	}

	onTick(status) {
		this.store.forEach((thr3d) => {
			thr3d.child.update(status);
		});
		// animate(status);
	}
	run(event: RunEvent): void {
		const id = 'talk3d';
		this.callback[id].forEach((fn) => fn(event));

		/* FIXME 
		- utiliser tick
		- trouver l'id
		- si je suppose que ce channel est unique pour plusieurs instances threejs, alors les callback doivent s'addresser à une seule scene à la fois ! 
		
		*/
		// console.log(event);

		// this.queue.add(id, {}, event.status);
	}

	setStore(store: StorePersoItems) {
		this.store = store;
	}

	addCallback = (id, fn) => {
		this.callback[id] ? this.callback[id].push(fn) : (this.callback[id] = [fn]);
	};
}

function animate(status: CbStatus) {
	// if (!mixer) return;
	// eyes.lookAt(camera.position);
	// const delta = status.delta / 1000;
	// mixer.update(delta);
	// renderer.render(scene, camera);
}

function onError(error: any) {
	console.error(error);
}
