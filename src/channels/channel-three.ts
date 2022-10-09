import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ChannelName } from '../types';
import { Channel, RunEvent } from './channel';
import { CbStatus } from '../clock';

const t3d = document.getElementById('t3d');
const appSize = { width: 1000, height: 600 };
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
camera.position.x = 0.2;
camera.position.y = 1.6;
camera.position.z = 1.4;
camera.lookAt(-0.2, 1.6, 1);

const duration = 0.3;

let precAction: THREE.AnimationAction;
let activeAction: THREE.AnimationAction;
let man: ThreeGLB;
let mixer: THREE.AnimationMixer;

const phonemes: string[] = [];
const visemes: Record<string, THREE.AnimationAction> = {};

loader.load('jay/jay.gltf', sceneLoaded, undefined, onError);

export class ThreeChannel extends Channel {
	name = ChannelName.THR3D;
	onTick(status) {
		animate(status);
	}
	run({ name, time, status, data }: RunEvent): void {
		console.log(name, time, data);
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
	loader.load('jay/lipsync.glb', animationsLoaded);
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
			animationAction.enabled = true;
			animationAction.setEffectiveTimeScale(1);
			animationAction.setEffectiveWeight(1);
			animationAction.play();
		} else {
			// animationAction.blendMode = THREE.AdditiveAnimationBlendMode;
			phonemes.push(anim.name);
		}
	}
}

function animate(status: CbStatus) {
	if (!mixer) return;
	// rotateCube();
	const delta = status.delta / 1000;
	mixer.update(delta);
	renderer.render(scene, camera);
}

function onError(error: any) {
	console.error(error);
}
