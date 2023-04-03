import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const SCENE = new THREE.Scene();
const CAM = new THREE.PerspectiveCamera(
  /* FOV */          75,
  /* Aspect Ratio */ window.innerWidth / window.innerHeight,
  /* Near Plane */   0.1,
  /* Far Plane */    1000
);

const RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(RENDERER.domElement);

const MAT = new THREE.MeshToonMaterial({ color: 0x303020 });

const LOADER = new GLTFLoader();

LOADER.load( "./assets/slands.glb", (gltf) => {
  SCENE.add(gltf.scene);
  
  for (let m of gltf.scene.children) {
    m.material = MAT;
  }
}, undefined, (err) => {
  console.error( error );
});

SCENE.background = new THREE.Color( 0x8080c0 );

CAM.position.x = -25;
CAM.position.y = 10;
CAM.position.z = 0;
CAM.lookAt(0, 0, 10);

const SUN = new THREE.DirectionalLight(0xffffcc, 3);
SCENE.add(SUN);

let sunangle = Math.PI / 4;

function tick() {
  requestAnimationFrame(tick);
  
  sunangle += 0.001;
  SUN.position.x = Math.cos(sunangle) * 100;
  SUN.position.z = Math.cos(sunangle) * 100;
  SUN.position.y = Math.sin(sunangle) * 100;
  
  RENDERER.render(SCENE, CAM);
}
tick();