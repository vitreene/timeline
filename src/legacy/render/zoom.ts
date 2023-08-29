// ZOOM////////////
/* TODO  
revoir la fonction avec un observer sur #container plutot
*/
const root = document.getElementById('app');
const stage = {
	width: 1600,
	height: 900,
	ratio: 16 / 9,
};
export function calculateZoom() {
	const el = root;

	// determiner l'échelle du projet, comparée à sa valeur par défaut.
	const width = el.clientWidth;
	const height = el.clientHeight;
	const wZoom = width / stage.width;
	const hScene = wZoom * stage.height;

	if (hScene > height) {
		const zoom = height / stage.height;
		const wScene = stage.width * zoom;
		return round({
			left: (width - wScene) / 2,
			top: 0,
			width: wScene,
			height,
			ratio: wScene / height,
			zoom,
		});
	} else {
		return round({
			left: 0,
			top: (height - hScene) / 2,
			width,
			height: hScene,
			ratio: hScene / width,
			zoom: wZoom,
		});
	}
}
type Round = Record<string, number>;
export function round(obj: Round): Round {
	const r = {};
	for (const e in obj) {
		r[e] = typeof obj[e] === 'number' ? parseFloat((obj[e] as number).toFixed(2)) : obj[e];
	}
	return r;
}
