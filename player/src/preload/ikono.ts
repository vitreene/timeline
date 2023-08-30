import {
	ImagesCollection,
	Img,
	PersoDef,
	PersoImgDef,
	PersoStore,
	PersosTypes,
} from 'player/src/sceneline/types';
type Srcs = string[];

const imgTypes = [PersosTypes.IMG, PersosTypes.SPRITE];

function isTypeImg(perso: PersoDef) {
	return imgTypes.includes(perso.type);
}
export async function registerImages(persos: PersoStore, imagesCollection: ImagesCollection): Promise<void> {
	const srcs = [] as Srcs;
	for (const id in persos) {
		const perso = persos[id];
		if (isTypeImg(perso)) srcs.push(...findSrcs(perso as PersoImgDef));
	}
	await loadImages(srcs, imagesCollection);
}

function findSrcs(perso: PersoImgDef) {
	const srcs = [perso.initial.content.src];
	if (perso.actions) {
		Object.values(perso.actions).forEach((action) => action.content.src && srcs.push(action.content.src));
	}
	return srcs;
}

export async function loadImages(srcs: string[] | Img[], imagesCollection) {
	return await Promise.all(
		srcs.map(
			(source: string | Img) =>
				new Promise((resolve, reject) => {
					const src = typeof source === 'string' ? source : source.src;
					const ikono = new Image();
					ikono.onload = () => {
						imagesCollection.set(src, {
							width: ikono.width,
							height: ikono.height,
							ratio: ikono.width / ikono.height,
							src,
						});
						resolve(true);
					};

					ikono.onerror = (err) => {
						imagesCollection.set(src, DEFAULT_IMG);
						return reject(err);
					};

					ikono.src = src;
				})
		)
	).catch((err) => console.log('on s‘est pas trompé ; ça a pas fonctionné', err));
}

export const DEFAULT_IMG = {
	width: 250,
	height: 250,
	ratio: 1,
	src: './ikono/placeholder.png',
};
