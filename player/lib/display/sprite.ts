import { Img, Initial, PersoImgDef } from '~/main';

export class Sprite {
	node = null;
	media: Img;
	attr: null;

	constructor(perso: PersoImgDef) {
		this.media = perso.media;
		this.update(perso.initial.content);
	}

	update({ src, ...content }: Partial<Initial> & Img) {
		const media = this.media[src];
		if (media.img instanceof HTMLImageElement) {
			if (!this.node) this.node = media.img;
			else {
				this.node.src = media.img.src;
			}
		} else {
			this.node = document.createElement('img');
			this.node.src = media.src;
		}
	}
}
