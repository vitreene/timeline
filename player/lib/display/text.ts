export class Txt {
	node = document.createTextNode('');
	update(text: string | number = '') {
		this.node.textContent = String(text);
	}
}

export class Svg {
	node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	update(inner) {
		this.node.appendChild(inner);
	}
}
