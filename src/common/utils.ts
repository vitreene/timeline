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

// affiner diff pour renoyer la différence, pas si l'object est différent
// recursive diff between two objects
export function diff(prec: any, next: any) {
	if (typeof prec === 'object' && typeof next === 'object') {
		const obj = {};
		const keys = Object.keys(next);
		for (const key of keys) {
			if (key === 'content') obj[key] = next[key];
			const value = diff(prec[key], next[key]);
			if (value !== null) obj[key] = value;
		}
		return Object.keys(obj).length ? obj : null;
	}
	if (prec === next) return null;
	return next;
}

// separe valeur et unités
const separe = /\s*(-?\d+\.?\d*)\s*(\D*)/;
export function splitUnitValue(val: string | number | undefined) {
	if (val === undefined) return null;
	if (typeof val === 'number') return { value: val, unit: null };
	const match = val.match(separe);
	return {
		value: Number(match[1]),
		unit: match[2],
	};
}
