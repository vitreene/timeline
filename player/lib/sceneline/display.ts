import { CONTAINER, ROOT, stage } from './constants';

import type { Action, StateAction } from '~/main';

import type { Persos } from './perso';

// TODO integrer Display à Persos.

export class Display {
	app: HTMLElement;
	persos: Persos;
	zoom = 1;
	removeResize: () => void;

	constructor(appId: string, persos: Persos) {
		this.app = document.getElementById(appId);
		this.persos = persos;
		this.root();
		this.initResize();
	}

	/* 
	//NOTE 
	zoom devrait appartenir aux roots de chaque story. comme ces concepts n'existent pas dans le player, attribuer une valeur de zoom à chaque perso.
	inscrire certains persos "root" dans la liste des éléments à surveiller pour le resize.
	reporter la valeur de zoom dans les éléments dépendants
	*/

	initResize() {
		const resizeObserver = new ResizeObserver((entries) => {
			const w = entries[0].contentBoxSize[0].inlineSize;
			const h = entries[0].contentBoxSize[0].blockSize;
			const hScene = (w / stage.width) * stage.height;
			const zoom = parseFloat((hScene > h ? h / stage.height : w / stage.width).toFixed(2));

			if (zoom === this.zoom) return;

			if (hScene >= h) {
				this.app.style.height = `${h}px`;
				this.app.style.width = `${stage.width * (h / stage.height)}px`;
			} else {
				this.app.style.height = `${stage.height * (w / stage.width)}px`;
				this.app.style.width = `${w}px`;
			}
			this.zoom = zoom;
			this.resize();
		});

		const container = document.getElementById(CONTAINER);
		resizeObserver.observe(container);
		this.removeResize = () => resizeObserver.unobserve(container);
	}

	resize = () => requestAnimationFrame(() => this.persos.renderAll(this.zoom));

	root = () => {
		const rootPerso = this.persos.store.get(ROOT);
		this.persos.render(ROOT, rootPerso.initial, this.zoom);
		this.app.appendChild(rootPerso.node);
	};

	renderer = (actions: StateAction) => {
		actions.forEach((action, id) => {
			this.persos.render(id, action, this.zoom);
		});
	};

	render(id: string, action: Action) {
		this.persos.render(id, action, this.zoom);
	}

	reset = () => {
		this.persos.reset();
		this.root();
	};
}
