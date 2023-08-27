import { Img } from '../types';

export class Sprite {
	node = document.createElement('img');
	constructor() {
		this.node.style.width = '100%';
		this.node.style.height = '100%';
		this.node.style.objectFit = 'contain';
	}
	update({ src, fit = 'contain', px = 'center', py = 'center' }: Img) {
		this.node.src = src;
		this.node.style.objectFit = fit;
		this.node.style.objectPosition = `${px} ${py}`;
	}
}
