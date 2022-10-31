import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Thr3d {
	node: HTMLElement = document.createElement('div');
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	animationActions: THREE.AnimationAction[];
	camera: THREE.PerspectiveCamera;
	store: Map<string, any>;
	constructor({ parentNode, initial }) {
		// this.node = parentNode;
		this.initScene(initial);
	}

	initScene(initial) {
		const appSize = { width: 500, height: 400 };
		this.scene = new THREE.Scene();
		this.scene.background = null;

		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(appSize.width, appSize.height);
		this.node.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(50, appSize.width / appSize.height, 0.1, 1000);
		this.camera.position.x = 0.01;
		this.camera.position.y = 1.6;
		this.camera.position.z = 1.1;
		this.camera.lookAt(0, 1.6, 1);

		const controls = new OrbitControls(this.camera, this.renderer.domElement);
		controls.enableDamping = true;
		controls.target.set(0, 1, 0);

		const light = new THREE.AmbientLight(0x404040, 5); // soft white light
		const light1 = new THREE.PointLight(0xffffff, 2);
		light1.position.set(2.5, 2.5, 2.5);
		this.scene.add(light, light1);

		this.animationActions = [];
	}
	update(content) {
		/* 
    content ne devrait recevoir que les mise à jour issues du channel 
    -> notif d'animation
    -> interpolations
    les incorporations d'elements à la scene se font autrement via add
    comment appeler add ?
    */
	}

	add(item) {
		const { scene, aminations } = item.media;
		console.log('ADD 3D', scene, aminations);
		this.scene.add(scene);

		this.renderer.render(this.scene, this.camera);
		/* 
item.type : perso | animation
*/
	}
}
