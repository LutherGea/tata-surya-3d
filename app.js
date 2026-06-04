import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 30, 60);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Bintang-bintang background
const starGeo = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = [];
for (let i = 0; i < starCount; i++) {
  starPositions.push(
    (Math.random() - 0.5) * 800,
    (Math.random() - 0.5) * 800,
    (Math.random() - 0.5) * 800
  );
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Lantai untuk shadow
const floorGeo = new THREE.PlaneGeometry(300, 300);
const floorMat = new THREE.MeshStandardMaterial({ 
  color: 0x000011, 
  roughness: 1, 
  metalness: 0 
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -10;
floor.receiveShadow = true;
scene.add(floor);

// Cahaya dari Matahari
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const sunLight = new THREE.PointLight(0xFFA500, 3, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Matahari
const sunGeo = new THREE.SphereGeometry(6, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Cahaya glow matahari
const sunGlow = new THREE.PointLight(0xFF6600, 2, 50);
scene.add(sunGlow);

// Data planet
const planetData = [
  { name: 'Merkurius', color: 0xAAAAAA, size: 1.0, distance: 12, speed: 0.04, info: 'Planet terkecil & tercepat' },
  { name: 'Venus',     color: 0xFFCC88, size: 1.5, distance: 18, speed: 0.025, info: 'Planet terpanas di tata surya' },
  { name: 'Bumi',      color: 0x3399FF, size: 1.8, distance: 25, speed: 0.02, info: 'Satu-satunya planet berpenghuni' },
  { name: 'Mars',      color: 0xFF4422, size: 1.3, distance: 33, speed: 0.015, info: 'Planet Merah' },
  { name: 'Jupiter',   color: 0xFFAA66, size: 4.0, distance: 45, speed: 0.008, info: 'Planet terbesar di tata surya' },
];

// Buat planet + orbit ring
const planets = [];
planetData.forEach(data => {
  // Orbit ring
  const orbitGeo = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
  const orbit = new THREE.Mesh(orbitGeo, orbitMat);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  // Planet
  const geo = new THREE.SphereGeometry(data.size, 32, 32);
  let mat;
  if (data.name === 'Bumi') {
    const earthTexture = textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
      );
    mat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.7,
      metalness: 0.1
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      metalness: 0.1
    });
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.userData = { name: data.name, info: data.info, distance: data.distance, speed: data.speed, angle: Math.random() * Math.PI * 2 };
  scene.add(mesh);
  planets.push(mesh);
});

// Cincin Saturnus — tambahan khusus untuk Jupiter (modifikasi jadi Jupiter pakai cincin)
const ringGeo = new THREE.RingGeometry(5.5, 8, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xCCAA88, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 3;
planets[4].add(ring); // tambah ke Jupiter

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 150;

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planetName = document.getElementById('planet-name');
let selected = null;
let hovered = null;

// Interaksi 1 — Hover: planet bersinar
window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planets);

  if (hovered && hovered !== selected) {
    hovered.material.emissive.set(0x000000);
  }
  if (hits.length > 0 && hits[0].object !== sun) {
    hovered = hits[0].object;
    hovered.material.emissive.setHex(0x333300);
    planetName.innerText = '🪐 ' + hovered.userData.name + ' — ' + hovered.userData.info;
    document.body.style.cursor = 'pointer';
  } else {
    hovered = null;
    if (!selected) planetName.innerText = 'Hover atau klik planet untuk info';
    document.body.style.cursor = 'default';
  }
});

// Interaksi 2 — Klik: planet membesar + info
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planets);

  if (selected) {
    selected.material.emissive.set(0x000000);
    selected.scale.setScalar(1);
    selected = null;
    planetName.innerText = 'Hover atau klik planet untuk info';
  }

  if (hits.length > 0) {
    selected = hits[0].object;
    selected.material.emissive.setHex(0x222200);
    selected.scale.setScalar(1.4);
    planetName.innerText = '✅ Dipilih: ' + selected.userData.name + ' — ' + selected.userData.info;
  }
});

// Animation Loop
renderer.setAnimationLoop(() => {
  // Rotasi matahari
  sun.rotation.y += 0.003;

  // Planet berevolusi mengelilingi matahari
  planets.forEach(planet => {
    planet.userData.angle += planet.userData.speed;
    planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
    planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
    planet.rotation.y += 0.01;
  });

  controls.update();
  renderer.render(scene, camera);
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});