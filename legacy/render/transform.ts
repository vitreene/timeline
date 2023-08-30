import { splitUnitValue } from '../../player/src/common/utils';
import type { PersoItem, Style } from 'player/src/types';

type CSSTransformParam =
	| 'perpective'
	| 'translate'
	| 'translateX'
	| 'translateY'
	| 'rotate'
	| 'scale'
	| 'scaleX'
	| 'scaleY'
	| 'skew'
	| 'skewX'
	| 'skewY'
	| 'matrix'
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
	translate: TransformItem;
	x: TransformItem;
	y: TransformItem;
	translateX: TransformItem;
	translateY: TransformItem;
	rotate: TransformItem;
	scale: TransformItem;
	scaleX: TransformItem;
	scaleY: TransformItem;
	skew: TransformItem;
	skewX: TransformItem;
	skewY: TransformItem;
	r?: TransformItem;
	s?: TransformItem;
	dX: CSSTransformParam;
	dY: CSSTransformParam;
};

export type TransformStyle = { [key in keyof TransformList]?: number };

const transformKeys = [
	'perpective',
	'translate',
	'translateX',
	'translateY',
	'x',
	'y',
	'rotate',
	'scale',
	'scaleX',
	'scaleY',
	'skew',
	'skewX',
	'skewY',
	'matrix',
	'matrixX',
	'matrixY',
	'matrixZ',
	'matrixW',
];

const transformList: Partial<TransformList> = {
	translate: { transform: 'translate', unit: 'px', zoomable: true },
	translateX: { transform: 'translateX', unit: 'px', zoomable: true },
	translateY: { transform: 'translateY', unit: 'px', zoomable: true },
	rotate: { transform: 'rotate', unit: 'deg', zoomable: false },
	scale: { transform: 'scale', unit: '', zoomable: false }, // true ?
	scaleX: { transform: 'scaleX', unit: '', zoomable: false }, // true ?
	scaleY: { transform: 'scaleY', unit: '', zoomable: false }, // true ?
	skew: { transform: 'skew', unit: '', zoomable: false },
	skewX: { transform: 'skewX', unit: '', zoomable: false },
	skewY: { transform: 'skewY', unit: '', zoomable: false },
	dX: 'matrixX',
	dY: 'matrixY',
};

// alias
transformList.r = transformList.rotate;
transformList.s = transformList.scale;
transformList.x = transformList.translateX;
transformList.y = transformList.translateY;

export function extractTransform(oldStyle: Style) {
	const style = {};
	const transform = {};
	for (const prop in oldStyle) {
		transformList.hasOwnProperty(prop) ? (transform[prop] = oldStyle[prop]) : (style[prop] = oldStyle[prop]);
	}
	return { style, transform };
}

export function withTransform(props: TransformStyle, zoom: number, perso: PersoItem) {
	if (Object.keys(props).length == 0) return null;
	Object.assign(perso.transform, props);

	const { dX, dY, ...other } = perso.transform;

	const transformer = [];
	for (const tr in other) {
		const index = transformKeys.findIndex((v) => v === tr);
		// FIXME other[tr] est toujours number, accepter string ?
		let { value, unit } = splitUnitValue(other[tr]);
		value *= !unit && transformList[tr].zoomable ? zoom : 1;

		unit = unit || transformList[tr].unit;
		transformer[index] = transformList[tr].transform + '(' + value.toFixed(2) + unit + ') ';
	}

	if (typeof dX === 'number' || typeof dY === 'number') {
		const indexMatrix = transformKeys.findIndex((v) => v === 'matrix');
		const coords = transformCoords(dX, dY, other.rotate as number, other.scale);
		transformer[indexMatrix] = ` matrix(1,0,0,1,${coords.x * zoom || 0},${coords.y * zoom || 0})`;
	}

	const transform = transformer.length ? transformer.join(' ') : null;
	return transform;
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
