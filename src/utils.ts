import { Style } from './types';

export function keyToLowercase(obj: Style) {
	const objLc = {};
	for (const prop in obj) objLc[stringToLowercase(prop)] = obj[prop];
	return objLc;
}
export function objectToString(obj: Style) {
	let str = '';
	for (const prop in obj) str += `${stringToLowercase(prop)}:${addSuffix(obj[prop])};`;
	return str;
}

function addSuffix(prop: string) {
	if (Number(prop)) return prop + 'px';
	return prop;
}

export function stringToLowercase(str) {
	return exceptions.has(str) ? str : str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

export const DEFAULT_STYLES = {
	x: 0,
	y: 0,
	dX: 0,
	dY: 0,
	s: 1,
	r: 0,
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	skew: 1,
	skewX: 1,
	skewY: 1,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	scaleZ: 1,
	rotate: 0,
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	opacity: 1,
	color: '#000',
};
const exceptions = new Set(Object.keys(DEFAULT_STYLES));
