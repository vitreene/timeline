import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import type { CbStatus } from '../../clock';
import type { Thr3dSceneNode } from '../../../types';

const defaults = { width: 500, height: 400 };

/* TODO 

les données à transmettre sont :
- des valeurs THREE[key] = value 
	si value est un objet, décomposer : 
		THREE[key][keyof value.x] = value.x

- ou des fonctions THREE[key](...value)
	dans ce cas , envoyer un objet : 
	value : { func: { name: 'lookAt', params:[1,0,1] } }
*/
const clock = new THREE.Clock();

export class Thr3d {
	node: HTMLElement;
	parentNode: HTMLElement;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	animationActions: THREE.AnimationAction[];
	camera: THREE.PerspectiveCamera;
	controls: OrbitControls;
	store = new Map<string, any>();
	mixers = new Map<string, THREE.AnimationMixer>();
	updates: Array<(status: CbStatus) => void> = [];

	constructor({ initial, parentNode }) {
		this.parentNode = parentNode;
		this.node = document.createElement('canvas');
		this.node.style.width = '100%';
		this.node.style.height = '100%';
		this.initScene(initial);
	}

	initScene(initial: Thr3dSceneNode['initial']) {
		const { renderer, camera, controls } = initial.content;
		this.scene = new THREE.Scene();
		this.scene.background = null;

		if (renderer) {
			const { type, params, ...props } = renderer;
			const renderer_ = new THREE[type]({ canvas: this.node, ...params });
			this.renderer = this.spreadProps(renderer_, props);
			const size = new THREE.Vector2();
			this.renderer.getSize(size);
			console.log('TH3D getSize', size);
		}
		if (camera) {
			const { type, params, ...props } = camera;
			const camera_ = new THREE[type](...params);
			this.camera = this.spreadProps(camera_, props);
		}

		if (controls) {
			const controls_ = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls = this.spreadProps(controls_, controls);
			this.controls.update();
		}

		// TODO ligth sont des persos
		const light = new THREE.AmbientLight(0x404040, 5); // soft white light
		const light1 = new THREE.PointLight(0xffffff, 2);
		light1.position.set(2.5, 2.5, 2.5);
		this.scene.add(light, light1);

		this.animationActions = [];

		// this.createTestCube();
	}

	/* 
    content ne devrait recevoir que les mise à jour issues du channel 
    -> notif d'animation
    -> interpolations
    les incorporations d'elements à la scene se font autrement via add
    comment appeler add ?
    */

	update(status: CbStatus & { style?: CSSStyleSheet }) {
		const delta = status.delta || 0;
		if (typeof delta !== 'number') console.log('<------Thr3d---->', { delta });
		this.mixers.forEach((mixer) => mixer.update(delta));

		// TODO
		this.store.has('eyes') && this.store.get('eyes').lookAt(this.camera.position);
		this.store.has('cube') && this.rotateCube();
		this.renderer.render(this.scene, this.camera);
	}

	resize(zoom) {
		// const size = this.parentNode.getBoundingClientRect();
		const width = parseInt(this.parentNode.style.width);
		const height = parseInt(this.parentNode.style.height);
		console.log('THR3 RESIZE', width, height);

		this.renderer.setSize(width, height);
	}
	add(id, item) {
		// const { scene, aminations } = item.media;
		console.log('ADD 3D', item);
		const { loaded, mixer } = item.emit?.loadeddata.data;

		let items3D;
		if (loaded) {
			items3D = loaded(item.media);
			if (mixer) items3D = items3D(this.mixers.get(mixer));
		} else items3D = { add: item.media };

		console.log('ADD 3D', items3D);

		if (items3D.add)
			for (const item3d of items3D.add) {
				this.scene.add(item3d.scene);
			}

		if (items3D.store)
			for (const item3d of items3D.store) {
				const name = item3d.name || item3d.scene.name;
				this.store.set(name, item3d);
			}

		if (items3D.mixer)
			for (const item3d of items3D.mixer) {
				const mixer = new THREE.AnimationMixer(item3d.scene);
				this.mixers.set(id, mixer);
			}

		this.renderer.render(this.scene, this.camera);

		if (items3D.channelStore) {
			return items3D.channelStore;
		}
	}

	private spreadProps(component, props) {
		for (const [key, value] of Object.entries(props)) {
			console.log(key, value);
			if (Array.isArray(value)) {
				component[key](...value);
			} else if (typeof value === 'object') {
				// pas de recursif...
				// component[key] = this.spreadProps(component[key], value);
				for (const [key1, value1] of Object.entries(value)) {
					component[key][key1] = value1;
				}
			} else component[key] = value;
		}
		return component;
	}
	createTestCube() {
		const cube = doCube();
		this.scene.add(cube);
		this.store.set('cube', cube);
	}

	private rotateCube() {
		const cube = this.store.get('cube');
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		cube.rotation.z += 0.01;
	}
}

function doCube() {
	const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	cube.position.y = 0.5;
	return cube;
}
