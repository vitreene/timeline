import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ChannelName } from '../types';
import { Channel, RunEvent } from './channel';
import { CbStatus } from '../clock';

const t3d = document.getElementById('t3d');
const appSize = { width: 500, height: 400 };
const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = null;
const renderer = new THREE.WebGLRenderer({ alpha: true });
const animationActions: THREE.AnimationAction[] = [];

const camera = new THREE.PerspectiveCamera(75, appSize.width / appSize.height, 0.1, 1000);

const light = new THREE.AmbientLight(0x404040, 5); // soft white light
const light1 = new THREE.PointLight(0xffffff, 2);
light1.position.set(2.5, 2.5, 2.5);
scene.add(light, light1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

renderer.setSize(appSize.width, appSize.height);
t3d && t3d.appendChild(renderer.domElement);
camera.position.x = 0.05;
camera.position.y = 1.6;
camera.position.z = 1.4;
camera.lookAt(0, 1.6, 1);

const duration = 0.3;

let precAction: THREE.AnimationAction;
let activeAction: THREE.AnimationAction;
let man: ThreeGLB;
let mixer: THREE.AnimationMixer;
let eyes: THREE.Object3D;

const phonemes: string[] = [];
const visemes: Record<string, THREE.AnimationAction> = {};

loader.load('wes/wes.gltf', sceneLoaded, undefined, onError);

export class ThreeChannel extends Channel {
	name = ChannelName.THR3D;
	onTick(status) {
		animate(status);
	}
	run({ name, time, status, data }: RunEvent): void {
		console.log(name, time, data);
		const d = data.duration ? data.duration / 1000 : 0;
		// const d = duration;
		precAction && precAction.stopFading();
		precAction = activeAction;
		activeAction = visemes[name];
		if (precAction && activeAction) {
			precAction.fadeOut(d).reset();
			activeAction.fadeIn(d).play();
		}
	}
}

interface ThreeGLB {
	scene: THREE.Object3D<THREE.Event>;
	animations: THREE.AnimationClip[];
}
function sceneLoaded(gltf: ThreeGLB) {
	console.log('sceneLoaded', gltf);

	gltf.scene.traverse((child) => {
		if (child.type == 'SkinnedMesh') {
			child.frustumCulled = false;
		}
	});
	man = gltf;
	man.scene.position.z = 1;
	scene.add(man.scene);
	loader.load('wes/lipsync.glb', animationsLoaded);
}

function animationsLoaded(gltf: ThreeGLB) {
	console.log('animationsLoaded', gltf);
	man.animations = gltf.animations;

	console.log('man', man);
	mixer = new THREE.AnimationMixer(man.scene);
	// man.add(gltf.scene.children[0]);
	for (const anim of man.animations) {
		if (anim.name !== 'stand_talk') {
			THREE.AnimationUtils.makeClipAdditive(anim);
		}
		const animationAction = mixer.clipAction(anim);
		animationAction.setLoop(THREE.LoopOnce, 1).setDuration(duration);
		visemes[anim.name] = animationAction;
		animationActions.push(animationAction);
		if (anim.name === 'stand_talk') {
			animationAction.setLoop(THREE.LoopRepeat, 4);
			animationAction.enabled = true;
			animationAction.setEffectiveTimeScale(0.5);
			animationAction.setEffectiveWeight(0.5);
			animationAction.play();
		} else {
			phonemes.push(anim.name);
		}
	}
	eyes = man.scene.getObjectByName('chareyes');
	console.log({ eyes });
}

function animate(status: CbStatus) {
	if (!mixer) return;
	eyes.lookAt(camera.position);
	const delta = status.delta / 1000;
	mixer.update(delta);
	renderer.render(scene, camera);
}

function onError(error: any) {
	console.error(error);
}
