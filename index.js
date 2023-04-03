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

const MAT = {
  ground:  new THREE.MeshToonMaterial({ color: 0x865e47 }),
  stone:   new THREE.MeshToonMaterial({ color: 0xa29a88 }),
  stone2:  new THREE.MeshToonMaterial({ color: 0x69586b, side: THREE.DoubleSide }),
  wood:    new THREE.MeshToonMaterial({ color: 0xaa833e }),
  black:   new THREE.MeshToonMaterial({ color: 0x101010 }),
  unknown: new THREE.MeshToonMaterial({ color: 0x803080 }),
};

//const MAT = new THREE.MeshToonMaterial({ color: 0x303020 });

const LOADER = new GLTFLoader();

LOADER.load( "./assets/slands.glb", (gltf) => {
  SCENE.add(gltf.scene);
  
  for (let m of gltf.scene.children) {
    switch (m.name) {
      case 'island-warp':
      case 'island-tree':
      case 'island-main':
      case 'windmill-floor':
        m.material = MAT.ground;
        break;
      case 'bridge-post-1':
      case 'bridge-post-2':
      case 'bridge-post-3':
      case 'bridge-post-4':
      case 'bridge-post-5':
      case 'bridge-post-6':
      case 'bridge-post-7':
      case 'bridge-post-7001':
      case 'dock':
      case 'dock-stairs':
      case 'tree':
      case 'Cube001':
      case 'windmill-blades':
      case 'Cylinder':
      case 'Cylinder010':
      case 'Cylinder004':
        m.material = MAT.wood;
        break;
      case 'sigil':
      case 'sigil001':
      case 'Cube':
      case 'windmill-steps-left':
      case 'windmill-steps-right':
      case 'Cylinder001':
      case 'Cylinder002':
      case 'Cylinder003':
      case 'Cylinder005':
      case 'Cylinder006':
      case 'Cylinder007':
      case 'Cylinder008':
      case 'Cylinder009':
        m.material = MAT.stone;
        break;
      case 'windmill-body':
      case 'Icosphere003':
        m.material = MAT.stone2;
        break;
      case 'Cylinder011':
        m.material = MAT.black;
        break;
      default:
        m.material = MAT.unknown;
        break;
    }
  }
}, undefined, (err) => {
  console.error( error );
});

SCENE.background = new THREE.Color( 0x6f6bf9 );

CAM.position.x = -25;
CAM.position.y = 10;
CAM.position.z = 0;
CAM.lookAt(0, 0, 10);

const SUN = new THREE.DirectionalLight(0xffffcc, 1);
SCENE.add(SUN);

let sunangle = Math.PI / 4;

function tick() {
  requestAnimationFrame(tick);
  
  sunangle += 0.00025;
  SUN.position.x = Math.cos(sunangle) * 100;
  SUN.position.z = Math.cos(sunangle) * 100;
  SUN.position.y = Math.sin(sunangle) * 100;
  
  RENDERER.render(SCENE, CAM);
}
tick();