import { div } from '.';

import type { MapAction, ActionClassList } from './types';

export function renderer(actions: MapAction) {
	actions.forEach((action) => {
		// console.log('renderer', action);
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
							updateStyle(div, s, style[s]);
						}
					}
					break;
				case 'className':
					updateClassList(div, action[attr]);
					break;

				default:
					break;
			}
		}
	});
}

export function updateClassList(node: Element, actions: string | ActionClassList) {
	if (typeof actions === 'string') node.classList.add(...actions.split(' '));
	else {
		for (const action in actions) {
			const className = Array.isArray(actions[action]) ? actions[action] : actions[action].split(' ');
			node.classList[action](...className);
		}
	}
}

function updateStyle(node: HTMLElement, item: string, prop: number) {
	// console.log('updateStyle', item, prop);

	if ('x' === item || 'y' === item) {
		node.style.translate = 'var(--translate-x) var(--translate-y)';
	}
	switch (item) {
		case 'x':
			node.style.setProperty('--translate-x', prop + 'px');
			break;
		case 'y':
			node.style.setProperty('--translate-y', prop + 'px');
			break;
		case 'font-size':
			// console.log('font-size', Math.round(prop));
			node.style.fontSize = prop + 'px';
			break;
		case 'top':
		case 'bottom':
		case 'left':
		case 'right':
			node.style[item] = prop + 'px';
			break;

		default:
			break;
	}
	node.style[item] = prop;
}
