import { SpriteInitial } from '../types';

export class Sprite {
	node = document.createElement('img');
	constructor() {
		this.node.style.width = '100%';
		this.node.style.height = '100%';
		this.node.style.objectFit = 'contain';
	}
	update({ src, fit = 'contain' }: SpriteInitial) {
		// console.log(src);

		this.node.src = src;
		this.node.style.objectFit = fit;
	}
}
