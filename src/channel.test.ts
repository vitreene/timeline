import { afterAll, it, describe, expect, assert } from 'vitest';

import { QueueActions } from './channel';

const callback = (update) => console.log('RENDER', update);

const Queue = new QueueActions(callback);

const action01 = { style: { x: 50 }, className: 'toto' };
const action02 = { style: { x: 25, y: 100, color: 'red' }, attr: { disabled: 'true' }, className: 'titi' };
Queue.add('element', action01);
Queue.add('element', action02);

describe('faire la queue', () => {
	it('has id', () => {
		expect(Queue.queue.has('element')).toBeTruthy();
	});
	it('has style', () => {
		const element = Queue.queue.get('element');
		const style01 = element.style[0];
		const style02 = element.style[1];
		expect(style01).toEqual(action01.style);
		expect(style02).toEqual(action02.style);
	});
});

afterAll(() => Queue.flush());
