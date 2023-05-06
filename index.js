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
  black:   new THREE.MeshToonMaterial({ color: 0xffe89f, gradientMap: TONE_MAP }),
  unknown: new THREE.MeshToonMaterial({ color: 0x803080, gradientMap: TONE_MAP }),
};

const LOADER = new GLTFLoader();

LOADER.load( "./assets/slands.glb", (gltf) => {
  SCENE.add(gltf.scene);
  
  for (let m of gltf.scene.children) {
    if (m.name !== "River") {
      m.castShadow = true;
      m.receiveShadow = true;
    } else {
      console.log(m);
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
        m.castShadow = false;
        m.receiveShadow = false;
        break;
      default:
        m.material = MAT.unknown;
        break;
    }
  }
  
  gltf.scene.children.find(m => m.name == "River").visible = false;
  
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
  
  CAMPFIRE.obj = gltf.scene.children.find(m => m.name == "Icosphere003");
  CAMPFIRE.light = new THREE.PointLight( 0xd66b3d );
  CAMPFIRE.light.distance = 6;
  CAMPFIRE.light.position.set( 2.5, 4.5, 3.5 );
  CAMPFIRE.light.intensity = 4;
  CAMPFIRE.obj.add(CAMPFIRE.light);
  CAMPFIRE.particles = [];
  {
    let map = new THREE.TextureLoader().load( "./assets/circle.png" );
    for (let i = 0; i < 40; i++) {
      let mat = new THREE.SpriteMaterial({ map: map });
      let particle = new THREE.Sprite(mat);
      particle.userData.velocity = new THREE.Vector3();
      particle.userData.velocity.x = Math.random() * 0.8 - 0.4;
      particle.userData.velocity.z = Math.random() * 0.8 - 0.4;
      particle.userData.velocity.y = Math.random() * 4 + 1;
      
      particle.userData.scale = Math.random() * 2 + 2;
      
      particle.userData.max_age = Math.random() * 1000 + 500;
      particle.userData.age = Math.random() * particle.userData.max_age;
      
      CAMPFIRE.obj.add(particle);
      
      CAMPFIRE.particles.push(particle);
    }
  }
  
  SIGILS.objs = gltf.scene
                     .children
                     .filter(m => [ "sigil",
                                    "sigil001",
                                    "Cube",     ].includes(m.name));
  
  console.log(SIGILS);
  SIGILS.particles = [];
  {
    let glyphs = [ new THREE.TextureLoader().load( "./assets/glyph0.png" ),
                   new THREE.TextureLoader().load( "./assets/glyph1.png" ),
                   new THREE.TextureLoader().load( "./assets/glyph2.png" ),
                   new THREE.TextureLoader().load( "./assets/glyph3.png" ),
                   new THREE.TextureLoader().load( "./assets/glyph4.png" ),
                   new THREE.TextureLoader().load( "./assets/glyph5.png" ), ];
    for (let i = 0; i < 48; i++) {
      let mat = new THREE.SpriteMaterial({ map: glyphs[i % 6] });
      let particle = new THREE.Sprite(mat);
      particle.userData.velocity = new THREE.Vector3();
      particle.userData.velocity.x = Math.random() * 0.14 - 0.08;
      particle.userData.velocity.z = Math.random() * 0.14 - 0.08;
      particle.userData.velocity.y = Math.random() * 0.14 - 0.08;
      
      particle.userData.color = (new THREE.Color( 0 )).setHSL(Math.random(), 1, 0.6);
      
      particle.userData.scale = Math.random() * 0.15 + 0.2;
      
      particle.userData.max_age = Math.random() * 3000 + 1500;
      particle.userData.age = Math.random() * particle.userData.max_age;
      
      SCENE.add(particle);
      
      SIGILS.particles.push(particle);
    }
  }
  
  tick();
}, undefined, (err) => {
  console.error( error );
});

const ISLANDS = { tree: null, main: null, warp: null };
const WINDMILL_BLADES = { };
const CAMPFIRE = { };
const SIGILS = {  };

SCENE.background = new THREE.Color( 0x6f6bf9 );

CAM.position.x = -20;
CAM.position.y = 10;
CAM.position.z = 0;
CAM.lookAt(10, 2, 10);

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
  let current_day_fraction;
  {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let st = s + (m + h * 60) * 60;
    current_day_fraction = st / (60 * 60 * 24);
  }
  sunangle = current_day_fraction * 2 * Math.PI - 0.5 * Math.PI;
  SUN.position.x = Math.cos(sunangle) * 100;
  SUN.position.z = Math.cos(sunangle) * 100;
  SUN.position.y = Math.sin(sunangle) * 100;
  
  // Island bobbing
  {
    let off1 = Math.cos(lastT / 5000) * 0.5;
    ISLANDS.tree.forEach(t => t.obj.position.y = t.orig_y + off1);
    
    
    let off2 = Math.cos(lastT / 10000 + (4 * Math.PI / 3));
    ISLANDS.main.forEach(t => t.obj.position.y = t.orig_y + off2);
    
    let off3 = Math.cos(lastT / 5000 + (2 * Math.PI / 3)) * 0.3;
    ISLANDS.warp.forEach(t => t.obj.position.y = t.orig_y + off3);
  }
  
  WINDMILL_BLADES.obj.rotation.x += 0.0005 * deltaT;
  
  // Campfire
  CAMPFIRE.light.intensity = Math.random() * 0.5 + 3.75;
  CAMPFIRE.light.distance = Math.random() * 0.5 + 5.75;
  CAMPFIRE.particles.forEach(p => {
    p.position.add(p.userData.velocity);
    p.userData.age += deltaT;
    if (p.userData.age > p.userData.max_age) {
      p.position.set(2.5, 4.5, 3.5);
      p.userData.age = 0;
    }
    p.scale
     .set(0, 0, 0)
     .add((new THREE.Vector3( 2, 2, 2 )).multiplyScalar(p.userData.scale)
                                        .multiplyScalar(0.5 + (p.userData.max_age - p.userData.age) / p.userData.max_age));
    p.material.color.lerpColors(new THREE.Color( 0x664444 ), new THREE.Color( 0xdddddd ), 1 - (p.userData.max_age - p.userData.age) / p.userData.max_age);
  });
  
  
  // Glyphs
  SIGILS.particles.forEach(p => {
    p.position.add(p.userData.velocity);
    p.userData.age += deltaT;
    if (p.userData.age > p.userData.max_age) {
      p.position.set(0, 0, 0).add(SIGILS.objs[Math.floor(Math.random() * SIGILS.objs.length)].position);
      p.userData.age = 0;
    }
    p.scale
     .set(0, 0, 0)
     .add((new THREE.Vector3( 2, 2, 2 )).multiplyScalar(p.userData.scale)
                                        .multiplyScalar(0.5 + (p.userData.max_age - p.userData.age) / p.userData.max_age));
    p.material.rotation += Math.cos(p.userData.max_age) * deltaT / 1000;
    p.material.color.lerpColors(p.userData.color, new THREE.Color( 0xffffff ), 1 - (p.userData.max_age - p.userData.age) / p.userData.max_age);
  });
  
  RENDERER.render(SCENE, CAM);
}