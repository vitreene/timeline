import { Img, Initial, PersoImgDef } from '~/main';

export class Sprite {
	node = document.createElement('img');
	media: Img;
	attr: null;

	constructor(perso: PersoImgDef) {
		this.media = perso.media;
		this.update(perso.initial.content);
	}

	update({ src, ...content }: Partial<Initial> & Img) {
		const media = this.media[src];

		if (media.img instanceof HTMLImageElement) {
			this.node.src = media.img.src;
		} else {
			this.node.src = media.src;
		}
	}
}
