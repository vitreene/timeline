import { afterAll, it, describe, expect, assert } from 'vitest';

import { QueueActions } from './queue';
import { interpolate } from './channel';

const callback = (update) => console.log('RENDER', update);

const Queue = new QueueActions(callback);

const action01 = { style: { x: 50 }, className: 'toto' };
const action02 = { style: { x: 25, y: 100, color: 'red' }, attr: { disabled: 'true' }, className: 'titi' };
Queue.add('element', action01);
Queue.add('element', action02);

describe('faire la queue', () => {
	it('has id', () => {
		expect(Queue.stack.has('element')).toBeTruthy();
	});
	it('has style', () => {
		const element = Queue.stack.get('element');
		const style01 = element.style[0];
		const style02 = element.style[1];
		expect(style01).toEqual(action01.style);
		expect(style02).toEqual(action02.style);
	});
});

describe('interpole', () => {
	it('à 0.5', () => {
		const from = { x: 100, y: 50 };
		const to = { x: 0, y: 100 };
		const start = 0;
		const end = 1;
		const time = 0.5;
		const i = interpolate({ from, to, start, end });
		expect(i(time)).toEqual({ x: 50, y: 75 });
		expect(i(start)).toEqual(from);
		expect(i(end)).toEqual(to);
	});
});

afterAll(() => Queue.flush());
