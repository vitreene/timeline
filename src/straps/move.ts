// voir aussi : https://developer.mozilla.org/fr/docs/Web/API/Element/setPointerCapture

interface DataMove {
	e: PointerEvent;
	id: string;
	ref: Element;
	startAngle: number;
	onmove: (obj: OnMoveData) => void;
	onup: (obj: OnUpData) => void;
	ondown?: (id: string) => void;
}

interface OnUpData {
	type: string;
	seuil: boolean;
	angle: number;
}
interface OnMoveData {
	type: string;
	theta: number;
	seuil: boolean;
	angle: number;
}

export class Move {
	id: string;
	state: OnMoveData;
	precAngle: number;
	startAngle: number;
	seuilLimit: number;
	e: PointerEvent;
	origin: { x: number; y: number };
	pointer: { x: number; y: number };
	onup: DataMove['onup'];
	onmove: DataMove['onmove'];
	ondown?: DataMove['ondown'];

	constructor(data: DataMove) {
		this.e = data.e;
		this.id = data.id;
		this.precAngle = 0;
		this.seuilLimit = -90;
		this.origin = this._setAxis(data.ref);
		this.pointer = { x: 0, y: 0 };
		this.state = { type: null, theta: 0, angle: 0, seuil: false };
		// this.startAngle = data.startAngle - this.seuilLimit;
		this.startAngle = data.startAngle;

		console.log('startAngle', this.startAngle);

		this.onup = data.onup;
		this.ondown = data.ondown;
		this.onmove = data.onmove;
		this.up = this.up.bind(this);
		this.down = this.down.bind(this);
		this.move = this.move.bind(this);

		this.down();
	}

	_setAxis(ref: Element) {
		const rect = ref.getBoundingClientRect();
		const x = rect.x + window.pageXOffset;
		const y = rect.y + window.pageYOffset;
		const middle = { x: x + rect.width / 2, y: y + rect.height / 2 };
		return middle;
	}

	down() {
		const { e } = this;
		e.preventDefault();
		e.stopPropagation();

		document.addEventListener('pointermove', this.move);
		document.addEventListener('pointerup', this.up);

		rotate.down.call(this, e);
	}

	move(e: PointerEvent) {
		e.preventDefault();
		e.stopPropagation();

		rotate.move.call(this, e);
	}

	up(e: PointerEvent) {
		e.preventDefault();
		e.stopPropagation();
		document.removeEventListener('pointermove', this.move);
		document.removeEventListener('pointerup', this.up);
		const { theta, ...state } = this.state;
		this.onup && this.onup(state);
	}

	point(event: PointerEvent & TouchEvent) {
		const e = event.targetTouches ? event.targetTouches[0] : event;
		return {
			x: e.clientX,
			y: e.clientY,
		};
	}

	seuil(angle: number) {
		let flag = false;
		if (
			angle < 0 &&
			this.precAngle < 0 &&
			this.precAngle < this.seuilLimit &&
			angle >= this.seuilLimit
		)
			flag = true;
		if (
			angle < 0 &&
			this.precAngle < 0 &&
			this.precAngle > this.seuilLimit &&
			angle <= this.seuilLimit
		)
			flag = true;
		this.precAngle = angle;
		return flag;
	}
}

// const move = (e: MouseEvent) => {
//   const { id, event } = this.data;

//   // sous le pointer
//   const below = document.elementFromPoint(e.clientX, e.clientY);
//   const belowChanged = below && below.id !== this.below;
//   const absPointer = {
//     x: window.scrollX + e.clientX,
//     y: window.scrollY + e.clientY,
//   };

//   const newPointer = {
//     x: absPointer.x - this.initialMousePosition.x,
//     y: absPointer.y - this.initialMousePosition.y,
//   };
//   const z = this.zoom;
//   const relativePointer = {
//     x: newPointer.x / z,
//     y: newPointer.y / z,
//   };

//   // diffuser l'event
//   if (belowChanged) {
//     const hover = this.reactions?.hover;
//     hover &&
//       emitter.emit([STRAP, hover], {
//         leave: this.below,
//         hover: below.id,
//         id,
//         event,
//       });

//     this.below = below.id;
//   }

//   emitter.emit([DEFAULT_NS, event], {
//     style: {
//       dX: relativePointer.x,
//       dY: relativePointer.y,
//     },
//   });
//   emitter.emit([STRAP, 'pointer'], {
//     relativeFromStart: newPointer,
//     relativeFromLast: relativePointer,
//     pointerFromStart: this.pointer,
//     pointeur: absPointer,
//   });

//   this.pointer = newPointer;
// };

const rotate = {
	down(e) {
		const point = this.point(e);
		this.pointer = {
			x: window.scrollX + point.x,
			y: window.scrollY + point.y,
		};
		const newPointer = {
			x: this.pointer.x / -this.origin.x,
			y: this.pointer.y / -this.origin.y,
		};
		this.distance = hypothenuse(newPointer.x, newPointer.y);

		this.ondown && this.ondown(this.id);
	},

	move(e) {
		const point = this.point(e);
		const absPointer = {
			x: window.scrollX + point.x,
			y: window.scrollY + point.y,
		};
		const newPointer = {
			x: absPointer.x - this.origin.x,
			y: absPointer.y - this.origin.y,
		};

		const theta = Math.atan2(newPointer.y, newPointer.x);
		const _angle = RADtoDEG(theta);

		// const minAngle = Math.abs(this.startAngle - _angle);

		// console.log(this.startAngle, _angle, minAngle, );

		const seuil = this.seuil(_angle);
		const angle = toFixed2(_angle < 0 ? (450 + _angle) % 360 : _angle + 90);

		this.pointer = newPointer;
		this.state = { type: this.id, theta, angle, seuil };
		this.onmove && this.onmove(this.state);
	},
};

export function RADtoDEG(rad) {
	return (rad * 180) / Math.PI;
}

export function DEGtoRAD(deg) {
	return (deg * Math.PI) / 180;
}

export function hypothenuse(x, y) {
	return Math.sqrt(x * x + y * y);
}

export function transformCoords(x = 0, y = 0, rotate = 0, s = 1) {
	const scale = 1 / s;
	const distance = hypothenuse(x, y);
	const angle = Math.atan2(y, x);
	const rad = DEGtoRAD(rotate);
	const coords = {
		x: distance * Math.cos(angle - rad) * scale,
		y: distance * Math.sin(angle - rad) * scale,
		distance,
		angle,
	};

	return coords;
}

export function round(precision) {
	return function (value) {
		return Number(value.toFixed(precision));
	};
}
export const toFixed2 = round(2);

export function objToFixed(obj) {
	const res = {};
	for (const o in obj) res[o] = toFixed2(obj[o]);
	return res;
}

export function isNumeric(num) {
	return !isNaN(num);
}
