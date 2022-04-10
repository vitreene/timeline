import { objectToString } from '../common/utils';

export function createPerso(id: string, { tag = 'div', ...initial }) {
	const el = document.createElement(tag);
	el.id = id;
	spread(el, initial);
	return function Perso(props?) {
		spread(el, props);
		return el;
	};
}

function spread(el: HTMLElement, props) {
	if (!props) return;
	for (const name in props) {
		switch (name) {
			case 'content':
			case 'children':
				el.innerHTML = props[name];
				break;
			case 'style':
				const style = objectToString(props[name]);

				el.setAttribute(name, style);
				break;
			default:
				el.setAttribute(name, props[name]);
				break;
		}
	}
}
