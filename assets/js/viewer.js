/* Longfly 3D viewer: shows a product's STL so visitors can drag to turn it and scroll or pinch to zoom.
   Loaded only when a product has a "model" in product.js and its section comes near the screen.
   three.js is vendored in assets/vendor/three so the site has no outside script dependency. */
import * as THREE from "../vendor/three/three.module.min.js";
import { OrbitControls } from "../vendor/three/OrbitControls.js";

// Reads binary or ASCII STL into a BufferGeometry.
function parseSTL(buf) {
  var dv = new DataView(buf);
  var n = buf.byteLength >= 84 ? dv.getUint32(80, true) : 0;
  var pos;
  if (84 + n * 50 === buf.byteLength) {
    pos = new Float32Array(n * 9);
    for (var i = 0; i < n; i++) {
      var o = 84 + i * 50 + 12;
      for (var j = 0; j < 9; j++) pos[i * 9 + j] = dv.getFloat32(o + j * 4, true);
    }
  } else {
    var text = new TextDecoder().decode(buf), re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g, m, out = [];
    while ((m = re.exec(text))) out.push(+m[1], +m[2], +m[3]);
    pos = new Float32Array(out);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

export function mount(box, url, opts) {
  opts = opts || {};
  var status = box.querySelector(".viewer-status");
  var setStatus = function (t) { if (status) { status.textContent = t; status.hidden = !t; } };
  setStatus("Loading 3D model…");

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  box.insertBefore(renderer.domElement, box.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f99, 2.2));
  var key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(1, 1.4, 1.2);
  camera.add(key);
  scene.add(camera);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.6;
  controls.addEventListener("start", function () { controls.autoRotate = false; });

  var home = null;
  function resize() {
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);
  resize();

  var visible = true;
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(box);
  renderer.setAnimationLoop(function () {
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  });

  var reset = box.querySelector(".viewer-reset");
  if (reset) reset.addEventListener("click", function () {
    if (!home) return;
    camera.position.copy(home);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
  });

  fetch(url).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.arrayBuffer();
  }).then(function (buf) {
    var g = parseSTL(buf);
    if ((opts.up || "z") === "z") g.rotateX(-Math.PI / 2);   // CAD exports are often Z-up; three.js is Y-up
    g.computeBoundingBox();
    var c = new THREE.Vector3();
    g.boundingBox.getCenter(c);
    g.translate(-c.x, -c.y, -c.z);
    g.computeBoundingSphere();
    var r = g.boundingSphere.radius;

    var mat = new THREE.MeshStandardMaterial({ color: opts.color || "#d9631c", roughness: 0.55, metalness: 0.05 });
    scene.add(new THREE.Mesh(g, mat));

    var dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * (opts.fit || 1.05);
    home = new THREE.Vector3(1, 0.55, 1).normalize().multiplyScalar(dist);
    camera.position.copy(home);
    camera.near = dist / 100; camera.far = dist * 10;
    camera.updateProjectionMatrix();
    controls.minDistance = r * 0.3;
    controls.maxDistance = dist * 3;
    setStatus("");
  }).catch(function () {
    setStatus("The 3D model couldn't load. Try refreshing the page.");
  });
}
