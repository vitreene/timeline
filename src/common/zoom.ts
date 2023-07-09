const APP = 'app';

// ZOOM////////////
const root = document.getElementById(APP);
const stage = {
	width: 1000,
	height: 750,
	ratio: 4 / 3,
};
export function calculateZoom() {
	const el = root;

	// determiner l'échelle du projet, comparée à sa valeur par défaut.
	const width = el.clientWidth;
	const height = el.clientHeight;
	const wZoom = width / stage.width;
	const hScene = wZoom * stage.height;

	const vw = window.innerWidth / 100;
	const vh = window.innerHeight / 100;
	const units = round({
		vw,
		vh,
		vmin: Math.min(vw, vh),
		vmax: Math.max(vw, vh),
	});
	if (hScene > height) {
		const zoom = height / stage.height;
		const wScene = stage.width * zoom;
		const wProps = round({
			left: (width - wScene) / 2,
			top: 0,
			width: wScene,
			height,
			ratio: wScene / height,
			zoom,
		});
		return { ...wProps, units };
	} else {
		const hProps = round({
			left: 0,
			top: (height - hScene) / 2,
			width,
			height: hScene,
			ratio: hScene / width,
			zoom: wZoom,
		});
		return { units, ...hProps };
	}
}

export function round<T extends Object>(obj: T): T {
	const r = {} as T;
	for (const e in obj) {
		if (typeof obj[e] === 'number') r[String(e)] = parseFloat((obj[e] as number).toFixed(2));
		else r[e] = obj[e];
	}
	return r;
}
