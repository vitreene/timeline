import { Tween } from './tween';

import type { Action, ActionClassList, AddToTick, DeltaFn, MapAction } from './types';

// TODO PROVISOIRE
import { div } from '.';

/*
class
register actions
register components ?
compose effects ?
*/

export class Actionner {
	actions: MapAction = new Map();
	ticker = null;
	tweens = new Set();
	state = new Map<string, any>();

	constructor(addToTick: AddToTick) {
		this.ticker = addToTick;
	}

	add = (actions: Map<string, any>) => {
		this.actions = new Map([...this.actions, ...actions]);
	};

	update = ({
		delta,
		time,
		name,
		data,
		seek = false,
	}: {
		delta: number;
		name: string;
		time: number;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			this.tweens.clear();
		}
		const action = { ...this.actions.get(name), ...data };

		for (const attr in action) {
			switch (attr) {
				case 'content':
					div.textContent = action[attr];
					break;
				case 'action':
					action[attr]();
					break;
				case 'style':
					{
						const style = action[attr];
						for (const s in style) {
							div.style[s] = style[s];
						}
					}
					break;
				case 'className':
					updateClassList(div, action[attr]);
					// div.classList.add(action[attr]);
					break;
				case 'transition':
					console.log('transition', time, delta, seek, action[attr]);
					this.tweens.add(new Tween(delta, action[attr], seek, this.ticker));
				default:
					break;
			}
		}
	};
}

function updateClassList(node: Element, actions: string | ActionClassList) {
	if (typeof actions === 'string') node.classList.add(...actions.split(' '));
	else {
		for (const action in actions) {
			const className = Array.isArray(actions[action]) ? actions[action] : actions[action].split(' ');
			node.classList[action](...className);
		}
	}
}
