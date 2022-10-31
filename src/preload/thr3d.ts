import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { PersoElementType } from '../types';
import type { Store, PersoStore, PersoNode } from '../types';
type Thr3DStore = any;

export function getPersoThr3D(persos: Store) {
	const persoOthers: PersoStore = {};
	const persoThr3D: Thr3DStore = {};
	for (const id in persos) {
		persos[id].type === PersoElementType.THR3D
			? (persoThr3D[id] = persos[id] as Thr3DStore)
			: (persoOthers[id] = persos[id] as PersoNode);
	}
	return { persoThr3D, persos: persoOthers };
}

const loaders = {
	gltf: new GLTFLoader(),
};

export async function registerThr3D(persos: Thr3DStore) {
	const thr3Ds = [];
	for (const id in persos) {
		const src = persos[id].initial.src;
		const loader = persos[id].initial.loader;
		thr3Ds.push(loadThr3D({ id, src, loader }));
	}
	const loadedThr3D = await Promise.all(thr3Ds);
	for (const [id, media] of loadedThr3D) persos[id].media = media;
	return persos;
}

interface LoadThr3DProps {
	id: string;
	src: string;
	loader: string;
}
function loadThr3D({ id, src, loader }: LoadThr3DProps) {
	return loaders[loader].loadAsync(src).then((media: any) => [id, media]);
}
