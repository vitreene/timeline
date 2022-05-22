import { splitUnitValue } from '../common/utils';
import type { Style } from 'src/types';

type CSSTransformParam =
	| 'translateX'
	| 'translateY'
	| 'rotate'
	| 'scale'
	| 'skewX'
	| 'skewY'
	| 'matrixX'
	| 'matrixY'
	| 'matrixZ'
	| 'matrixW';

type TransformUnit =
	| ''
	| 'px'
	| '%'
	| 'em'
	| 'rem'
	| 'vh'
	| 'vw'
	| 'vmin'
	| 'vmax'
	| 'deg'
	| 'rad'
	| 'turn'
	| 's'
	| 'ms'
	| 'Hz'
	| 'kHz'
	| 'dpi'
	| 'dpcm'
	| 'dppx';

type TransformItem = { transform: CSSTransformParam; unit: TransformUnit; zoomable: boolean };

type TransformList = {
	x: TransformItem;
	y: TransformItem;
	rotate: TransformItem;
	scale: TransformItem;
	skewX: TransformItem;
	skewY: TransformItem;
	r?: TransformItem;
	s?: TransformItem;
	dX: CSSTransformParam;
	dY: CSSTransformParam;
};

type TransformStyle = { [key in keyof TransformList]?: number };

const transformList: TransformList = {
	x: { transform: 'translateX', unit: 'px', zoomable: true },
	y: { transform: 'translateY', unit: 'px', zoomable: true },
	rotate: { transform: 'rotate', unit: 'deg', zoomable: false },
	scale: { transform: 'scale', unit: '', zoomable: false }, // true ?
	skewX: { transform: 'skewX', unit: '', zoomable: false },
	skewY: { transform: 'skewY', unit: '', zoomable: false },
	dX: 'matrixX',
	dY: 'matrixY',
};

// alias
transformList.r = transformList.rotate;
transformList.s = transformList.scale;

export function extractTransform(oldStyle: Style) {
	const style = {};
	const transform = {};
	for (const prop in oldStyle) {
		transformList.hasOwnProperty(prop) ? (transform[prop] = oldStyle[prop]) : (style[prop] = oldStyle[prop]);
	}
	return { style, transform };
}

export function withTransform(props: TransformStyle, zoom: number) {
	const { dX, dY, ...other } = props;

	let transform = '';
	for (const tr in other) {
		// console.log("other, tr", other, tr);
		let { value, unit } = splitUnitValue(other[tr]);

		value *= !unit && transformList[tr].zoomable ? zoom : 1;
		unit = unit || transformList[tr].unit;
		transform += transformList[tr].transform + '(' + value.toFixed(2) + unit + ') ';
	}
	if (typeof dX === 'number' || typeof dY === 'number') {
		// if (dX || dY) {
		const coords = transformCoords(dX, dY, other.rotate as number, other.scale);
		transform += ` matrix(1,0,0,1,${coords.x * zoom || 0},${coords.y * zoom || 0})`;
	}
	return transform ? { transform } : null;
}

function transformCoords(x = 0, y = 0, rotate = 0, s = 1) {
	const scale = 1 / s;
	const distance = hypothenuse(x, y);
	const angle = Math.atan2(y, x);
	const rad = DEGtoRAD(rotate);
	const coords = {
		x: distance * Math.cos(angle - rad) * scale,
		y: distance * Math.sin(angle - rad) * scale,
	};

	return coords;
}

function hypothenuse(x, y) {
	return Math.sqrt(x * x + y * y);
}
function DEGtoRAD(deg) {
	return (deg * Math.PI) / 180;
}
