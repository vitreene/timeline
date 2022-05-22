import { Style } from '../types';
import { exceptions, whiteListCssProps } from './constants';

export function keyToLowercase(obj: Style) {
	const objLc = {};
	for (const prop in obj) objLc[stringToLowercase(prop)] = obj[prop];
	return objLc;
}
export function objectToString(obj: Style) {
	let str = '';
	for (const key in obj) str += `${stringToLowercase(key)}:${addSuffix(key, obj[key])};`;
	return str;
}

export function addSuffix(key, value: string, zoom = 1) {
	if (Number(value) && whiteListCssProps.has(key)) return Number(value) * zoom + 'px';
	return value;
}

export function stringToLowercase(str) {
	return exceptions.has(str) ? str : str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
//convert  string Snake To Camel
export function stringSnakeToCamel(str: string) {
	return str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

// recursive diff between two objects
export function diff(prec: any, next: any) {
	if (prec === next) return null;
	if (typeof prec === 'object' && typeof next === 'object') {
		const keys = Object.keys(prec);
		if (keys.length !== Object.keys(next).length) {
			return next;
		} else {
			for (const key of keys) {
				if (diff(prec[key], next[key]) !== null) return next;
			}
			return null;
		}
	}
	return next;
}

// separe valeur et unités
const separe = /\s*(\d+)\s*(\D*)/;
export function splitUnitValue(val: string | number | undefined) {
	if (val === undefined) return null;
	if (typeof val === 'number') return { value: val, unit: null };
	const match = val.match(separe);
	return {
		value: Number(match[1]),
		unit: match[2],
	};
}
