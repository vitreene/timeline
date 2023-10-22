import { Img, PersoImgDef } from '~/main';

export class Sprite {
	node = null;
	constructor(perso: PersoImgDef) {
		this.init(perso);
	}

	init(perso: PersoImgDef) {
		console.log(perso);
		const src = perso.initial?.content.src;
		const media = perso.media?.[src];
		console.log(src, media);

		if (media && media.img instanceof HTMLImageElement) {
			this.node = media.img;
			this.update(perso.initial.content);
		} else {
			this.node = document.createElement('img');
			this.node.src = src;
			this.node.onload = () => this.update(perso.initial.content);
		}
	}

	initImg() {
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
