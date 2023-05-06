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

RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.soft = false;

document.body.appendChild(RENDERER.domElement);

const TONE_MAP = new THREE.TextureLoader().load("./assets/three-tone.jpg");
TONE_MAP.minFilter = THREE.NearestFilter;
TONE_MAP.magFilter = THREE.NearestFilter;

const MAT = {
  ground:  new THREE.MeshToonMaterial({ color: 0x865e47, gradientMap: TONE_MAP }),
  stone:   new THREE.MeshToonMaterial({ color: 0xa29a88, gradientMap: TONE_MAP }),
  stone2:  new THREE.MeshToonMaterial({ color: 0x69586b, gradientMap: TONE_MAP, side: THREE.DoubleSide }),
  wood:    new THREE.MeshToonMaterial({ color: 0xaa833e, gradientMap: TONE_MAP }),
  black:   new THREE.MeshToonMaterial({ color: 0x101010, gradientMap: TONE_MAP }),
  unknown: new THREE.MeshToonMaterial({ color: 0x803080, gradientMap: TONE_MAP }),
};

const LOADER = new GLTFLoader();

LOADER.load( "./assets/slands.glb", (gltf) => {
  SCENE.add(gltf.scene);
  
  for (let m of gltf.scene.children) {
    if (m.name !== "River") {
      m.castShadow = true;
      m.receiveShadow = true;
    }
    
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
  
  ISLANDS.tree = gltf.scene
                     .children
                     .filter(m => [ "island-tree",
                                    "tree",
                                    "sigil",
                                    "bridge-post-7",
                                    "bridge-post-7001", ].includes(m.name))
                     .map(m => ({ orig_y: m.position.y, obj: m }));
  
  
  ISLANDS.main = gltf.scene
                     .children
                     .filter(m => [ "island-main",
                                    "windmill-body",
                                    "windmill-blades",
                                    "windmill-floor",
                                    "Cylinder011",
                                    "windmill-steps-left",
                                    "windmill-steps-right",
                                    "Cube001",
                                    "sigil001",
                                    "bridge-post-1",
                                    "bridge-post-2",
                                    "bridge-post-5",
                                    "bridge-post-6",
                                    "dock",
                                    "dock-stairs",
                                    "Icosphere003",
                                    "Cylinder",
                                    "Cylinder004",
                                    "Cylinder010",         ].includes(m.name))
                     .map(m => ({ orig_y: m.position.y, obj: m }));
  
  
  ISLANDS.warp = gltf.scene
                     .children
                     .filter(m => [ "island-warp",
                                    "Cube",
                                    "bridge-post-3",
                                    "bridge-post-4",
                                    "Cylinder001",
                                    "Cylinder002",
                                    "Cylinder003",
                                    "Cylinder005",
                                    "Cylinder006",
                                    "Cylinder007",
                                    "Cylinder008",
                                    "Cylinder009",   ].includes(m.name))
                     .map(m => ({ orig_y: m.position.y, obj: m }));
  
  WINDMILL_BLADES.obj = gltf.scene.children.find(m => m.name == "windmill-blades");
  
  tick();
}, undefined, (err) => {
  console.error( error );
});

const ISLANDS = { tree: null, main: null, warp: null };
const WINDMILL_BLADES = { };

SCENE.background = new THREE.Color( 0x6f6bf9 );

CAM.position.x = -25;
CAM.position.y = 10;
CAM.position.z = 0;
CAM.lookAt(0, 0, 10);

const SUN = new THREE.DirectionalLight(0xffffcc, 1);
SCENE.add(SUN);

SUN.castShadow = true;
SUN.shadow.bias = -0.001;
SUN.shadow.camera.left    = -20;
SUN.shadow.camera.right   = 20;
SUN.shadow.camera.top     = 20;
SUN.shadow.camera.bottom  = -20;
SUN.shadow.mapSize.width  = 2048;
SUN.shadow.mapSize.height = 2048;

console.log(SUN.shadow);

let sunangle = 3 * Math.PI / 4;

let lastT = 0;

function tick(nextT) {
  if (!nextT) {
    requestAnimationFrame(tick);
    return;
  }
  
  let deltaT = nextT - lastT;
  
  requestAnimationFrame(tick);
  
  if (deltaT < 1000 / 14) return; // Artificially limit frame rate to 14fps
  
  lastT = nextT;
  
  // Sun light position
  sunangle += 0.00000025 * deltaT;
  SUN.position.x = Math.cos(sunangle) * 100;
  SUN.position.z = Math.cos(sunangle) * 100;
  SUN.position.y = Math.sin(sunangle) * 100;
  
  // Island bobbing
  {
    let off1 = Math.cos(lastT / 10000) * 0.5;
    ISLANDS.tree.forEach(t => t.obj.position.y = t.orig_y + off1);
    
    
    let off2 = Math.cos(lastT / 10000 + (4 * Math.PI / 3));
    ISLANDS.main.forEach(t => t.obj.position.y = t.orig_y + off2);
    
    let off3 = Math.cos(lastT / 10000 + (2 * Math.PI / 3)) * 0.3;
    ISLANDS.warp.forEach(t => t.obj.position.y = t.orig_y + off3);
  }
  
  WINDMILL_BLADES.obj.rotation.x += 0.0005 * deltaT;
  
  RENDERER.render(SCENE, CAM);
}