import { Style } from '../../../legacy/types';
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

export function addSuffix(key: string, value: unknown, zoom = 1) {
	if (Number(value) && whiteListCssProps.has(key)) return Number(value) * zoom + 'px';
	return value;
}

export function stringToLowercase(str) {
	return exceptions.has(str) ? str : str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
//convert  string Snake To Camel
export function stringSnakeToCamel(str: string) {
	return str
		.toLowerCase()
		.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

export const toKebabCase = (str: string) =>
	str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());

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

// renvoie un tableau s'il n'en est pas un :
export function toArray<T>(value: T | T[]): T[] {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

// raccourci pour hasOwnProperty
export const hasOwn = (obj: Record<string, unknown>, key: string): boolean =>
	Object.prototype.hasOwnProperty.call(obj, key);

export function has(property: Style, key: string) {
	return Object.prototype.hasOwnProperty.call(property, key) ? property[key] : null;
}

export const noop = <T>(any: T): T => any;

export type DevMessage = (check: boolean, message: string) => void;

let warning: DevMessage = noop;
let invariant: DevMessage = noop;
export { warning, invariant };

type Round = Record<string, number>;
export function round(obj: Round): Round {
	const r = {};
	for (const e in obj) {
		r[e] = typeof obj[e] === 'number' ? parseFloat((obj[e] as number).toFixed(2)) : obj[e];
	}
	return r;
}

export function deepClone(obj, hash = new WeakMap()) {
	if (Object(obj) !== obj) return obj; // primitives
	if (hash.has(obj)) return hash.get(obj); // cyclic reference
	const result =
		obj instanceof Set
			? new Set(obj) // See note about this!
			: obj instanceof Map
			? new Map(Array.from(obj, ([key, val]) => [key, deepClone(val, hash)]))
			: obj instanceof Date
			? new Date(obj)
			: obj instanceof RegExp
			? new RegExp(obj.source, obj.flags)
			: // ... add here any specific treatment for other classes ...
			// and finally a catch-all:
			obj.constructor
			? new obj.constructor()
			: Object.create(null);
	hash.set(obj, result);
	return Object.assign(result, ...Object.keys(obj).map((key) => ({ [key]: deepClone(obj[key], hash) })));
}
