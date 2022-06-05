import { CbStatus } from '../clock';
import { Strap } from './strap';

/* 
la classe Move doit etre dérivée pour traiter la rotation, le drag-drop, etc.

comment controler ce qui est emit :
- associer des callbacks à chaque étape
- le principe, le cd est un objet -> handler (cb) : envoie à un autre strap ?
- si c'est une function -> cb(data)

comment formaliser ces données et ces actions ?
onstart -> après initialisation du comportement
onchange -> formate les données du pointeur
onend  -> que faire lorsqu'on relache le pointeur
*/

export class MoveStrap extends Strap {
	static publicName = 'move';

	data: any;
	initialMousePosition = {
		x: 0,
		y: 0,
	};

	run = (status: CbStatus, state: any) => {
		console.log('init', state);
		this.initialMousePosition = point(state.emit.e);
		this.ondown();
		const startTime = status.currentTime;
		const endTime = startTime + 1000;
		this.data = { ...state, startTime, endTime };
	};

	ondown() {
		document.addEventListener('pointermove', this.move);
		document.addEventListener('pointerup', this.up);
	}
	onup() {
		document.removeEventListener('pointermove', this.move);
		document.removeEventListener('pointerup', this.up);
	}

	up = (e: PointerEvent) => {
		console.log('up');
		this.onup();
	};
	move = (e: PointerEvent) => {
		e.preventDefault();
		e.stopPropagation();

		move.call(this, e);
	};
}

function point(event: PointerEvent & TouchEvent) {
	const e = event.targetTouches ? event.targetTouches[0] : event;
	return {
		x: e.clientX,
		y: e.clientY,
	};
}

function whoIsBelow(e: MouseEvent) {
	// sous le pointer
	const below = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
	// const belowChanged = below && below.id !== this.below;
	return below.dataset.id || below.id;
	// // diffuser l'event
	// if (belowChanged) {
	//   const hover = this.reactions?.hover;
	//   hover &&
	//     emitter.emit([STRAP, hover], {
	//       leave: this.below,
	//       hover: below.id,
	//       id,
	//       event,
	//     });

	//   this.below = below.id;
	// }
}

function move(e: MouseEvent) {
	// const { id, event } = this.data;

	const absPointer = {
		x: window.scrollX + e.clientX,
		y: window.scrollY + e.clientY,
	};
	const newPointer = {
		x: absPointer.x - this.initialMousePosition.x,
		y: absPointer.y - this.initialMousePosition.y,
	};

	const z = this.store.zoom;
	const relativePointer = {
		x: newPointer.x / z,
		y: newPointer.y / z,
	};

	// emitter.emit([DEFAULT_NS, event], {
	//   style: {
	//     dX: relativePointer.x,
	//     dY: relativePointer.y,
	//   },
	// });
	// emitter.emit([STRAP, 'pointer'], {
	//   relativeFromStart: newPointer,
	//   relativeFromLast: relativePointer,
	//   pointerFromStart: this.pointer,
	//   pointeur: absPointer,
	// });

	const x = Math.round(newPointer.x);
	const y = Math.round(newPointer.y);
	// this.queue.add(this.data.emit.id, { style: { transform: `translate(${x}px, ${y}px)` } });
	// this.queue.add(this.data.emit.id, { style: { x: `${x}px`, y: `${y}px` } });
	this.queue.add(this.data.emit.id, { style: { x, y } });

	this.pointer = newPointer;
	return newPointer;
}
