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

function addSuffix(key, value: string) {
	if (Number(value) && whiteListCssProps.has(key)) return value + 'px';
	return value;
}

export function stringToLowercase(str) {
	return exceptions.has(str) ? str : str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
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
