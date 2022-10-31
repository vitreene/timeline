import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const defaults = { width: 500, height: 400 };

export class Thr3d {
	node: HTMLElement;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	animationActions: THREE.AnimationAction[];
	camera: THREE.PerspectiveCamera;
	controls: OrbitControls;
	store = new Map<string, any>();

	constructor({ initial }) {
		this.node = document.createElement('canvas');
		this.node.style.width = '100%';
		this.node.style.height = '100%';
		this.initScene(initial);
	}

	private spreadProps(component, props) {
		for (const [key, value] of Object.entries(props)) {
			if (typeof value === 'object') {
				// pas de recursif...
				// component[key] = this.spreadProps(component[key], value);
				for (const [key1, value1] of Object.entries(value)) {
					component[key][key1] = value1;
				}
			} else if (Array.isArray(value)) component[key](...value);
			else component[key] = value;
		}
		return component;
	}

	initScene(initial) {
		console.log({ initial });
		const { renderer, camera, controls } = initial.content;

		this.scene = new THREE.Scene();
		this.scene.background = null;

		if (renderer) {
			const { type, params, ...props } = renderer;
			const renderer_ = new THREE[type]({ canvas: this.node, ...params });
			this.renderer = this.spreadProps(renderer_, props);
			console.log(this.renderer.getSize);
		}
		if (camera) {
			const { type, params, ...props } = camera;
			const camera_ = new THREE[type](...params);
			this.camera = this.spreadProps(camera_, props);
		}

		if (controls) {
			const controls_ = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls = this.spreadProps(controls_, controls);
		}

		const light = new THREE.AmbientLight(0x404040, 5); // soft white light
		const light1 = new THREE.PointLight(0xffffff, 2);
		light1.position.set(2.5, 2.5, 2.5);
		this.scene.add(light, light1);

		this.animationActions = [];
	}
	update(content) {
		console.log('<------Thr3d---->');
		console.log(content);

		/* 
    content ne devrait recevoir que les mise à jour issues du channel 
    -> notif d'animation
    -> interpolations
    les incorporations d'elements à la scene se font autrement via add
    comment appeler add ?
    */
	}

	add(item) {
		// const { scene, aminations } = item.media;
		console.log('ADD 3D', item);
		const items3D = item.emit.loadeddata.data.sceneLoaded(item.media);
		console.log('ADD 3D', items3D);

		for (const item3d of items3D.add) {
			this.scene.add(item3d.scene);
		}
		for (const item3d of items3D.store) {
			this.store.set(item3d.name, item3d);
		}

		console.log('ADD 3D', this.store);
		// console.log('ADD 3D', scene, aminations);
		// this.scene.add(scene);
		this.renderer.render(this.scene, this.camera);
		/* 
item.type : perso | animation
*/
	}
}
