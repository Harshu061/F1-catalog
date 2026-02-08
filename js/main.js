/* ============================= */
/* IMPORTS (MUST BE FIRST) */
/* ============================= */
import * as THREE from "./three.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.152/examples/jsm/loaders/GLTFLoader.js";

/* ============================= */
/* API TEST */
/* ============================= */
fetch(`${window.API_BASE_URL}/drivers`)
  .then(res => res.json())
  .then(data => {
    console.log("Drivers:", data);
  })
  .catch(err => console.error(err));

/* ============================= */
/* TEAM SCROLL ANIMATION */
/* ============================= */
const teamObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".team-card").forEach(card => {
  teamObserver.observe(card);
});

/* ============================= */
/* THREE.JS */
/* ============================= */
const canvas = document.getElementById("f1-canvas");

if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(4, 2, 6);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 1.2);
  directional.position.set(5, 5, 5);
  scene.add(directional);

  const loader = new GLTFLoader();
  loader.load("assets/f1_car.glb", gltf => {
    const car = gltf.scene;
    car.scale.set(1.2, 1.2, 1.2);
    car.rotation.y = Math.PI;
    scene.add(car);

    function animate() {
      requestAnimationFrame(animate);
      car.rotation.y += 0.002;
      renderer.render(scene, camera);
    }

    animate();
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
