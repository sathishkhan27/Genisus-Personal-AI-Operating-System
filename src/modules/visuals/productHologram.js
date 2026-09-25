import * as THREE from 'three';

export class ProductHologramViewer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.productGroup = new THREE.Group();
    this.currentProductType = 'laptop';
    this.isWireframeOnly = false;
    this.exploded = false;
    this.clock = new THREE.Clock();
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.init();
  }

  init() {
    const width = this.canvas.clientWidth || 400;
    const height = this.canvas.clientHeight || 260;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 1.5, 4.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene.add(this.productGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(6, 12, 0x00f0ff, 0x004466);
    gridHelper.position.y = -1.2;
    this.scene.add(gridHelper);

    this.setupLighting();
    this.setupInteractivity();
    this.loadProductModel('laptop');

    this.animate();
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0x00f0ff, 0.8);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 2, 10);
    cyanPoint.position.set(0, 0, 3);
    this.scene.add(cyanPoint);
  }

  setupInteractivity() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.productGroup.rotation.y += deltaX * 0.01;
      this.productGroup.rotation.x += deltaY * 0.01;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  loadProductModel(type) {
    this.currentProductType = type;
    // Clear existing meshes
    while (this.productGroup.children.length > 0) {
      this.productGroup.remove(this.productGroup.children[0]);
    }

    const holoMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: this.isWireframeOnly,
      transparent: true,
      opacity: 0.75,
      metalness: 0.8,
      roughness: 0.2
    });

    const glassMaterial = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });

    if (type === 'laptop') {
      // Laptop Base
      const baseGeo = new THREE.BoxGeometry(2.4, 0.08, 1.6);
      const baseMesh = new THREE.Mesh(baseGeo, holoMaterial);
      baseMesh.position.y = -0.3;
      baseMesh.name = 'base';
      this.productGroup.add(baseMesh);

      // Keyboard plate
      const kbGeo = new THREE.BoxGeometry(2.0, 0.02, 1.0);
      const kbMesh = new THREE.Mesh(kbGeo, glassMaterial);
      kbMesh.position.set(0, -0.25, 0.1);
      kbMesh.name = 'keyboard';
      this.productGroup.add(kbMesh);

      // Screen Lid
      const lidGeo = new THREE.BoxGeometry(2.4, 1.5, 0.06);
      const lidMesh = new THREE.Mesh(lidGeo, holoMaterial);
      lidMesh.position.set(0, 0.45, -0.75);
      lidMesh.rotation.x = -0.2;
      lidMesh.name = 'screen';
      this.productGroup.add(lidMesh);

      // Display glow panel
      const displayGeo = new THREE.PlaneGeometry(2.2, 1.3);
      const displayMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const displayMesh = new THREE.Mesh(displayGeo, displayMat);
      displayMesh.position.set(0, 0.45, -0.71);
      displayMesh.rotation.x = -0.2;
      displayMesh.name = 'display';
      this.productGroup.add(displayMesh);

    } else if (type === 'phone') {
      // Smartphone chassis
      const phoneGeo = new THREE.BoxGeometry(1.2, 2.2, 0.12);
      const phoneMesh = new THREE.Mesh(phoneGeo, holoMaterial);
      this.productGroup.add(phoneMesh);

      // Screen
      const scrGeo = new THREE.PlaneGeometry(1.1, 2.0);
      const scrMesh = new THREE.Mesh(scrGeo, glassMaterial);
      scrMesh.position.z = 0.065;
      this.productGroup.add(scrMesh);

      // Camera module bump
      const camBumpGeo = new THREE.BoxGeometry(0.4, 0.5, 0.08);
      const camBumpMesh = new THREE.Mesh(camBumpGeo, holoMaterial);
      camBumpMesh.position.set(-0.3, 0.7, -0.07);
      this.productGroup.add(camBumpMesh);

    } else if (type === 'watch') {
      // Smartwatch body
      const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, holoMaterial);
      this.productGroup.add(bodyMesh);

      // Watch Straps
      const strapGeo = new THREE.BoxGeometry(0.7, 0.1, 2.6);
      const strapMesh = new THREE.Mesh(strapGeo, glassMaterial);
      strapMesh.position.y = -0.1;
      this.productGroup.add(strapMesh);

      // Dial face
      const dialGeo = new THREE.CircleGeometry(0.75, 32);
      const dialMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.5 });
      const dialMesh = new THREE.Mesh(dialGeo, dialMat);
      dialMesh.rotation.x = -Math.PI / 2;
      dialMesh.position.y = 0.16;
      this.productGroup.add(dialMesh);

    } else {
      // Generic IoT / Drone device
      const coreGeo = new THREE.OctahedronGeometry(1.0, 1);
      const coreMesh = new THREE.Mesh(coreGeo, holoMaterial);
      this.productGroup.add(coreMesh);

      const ringGeo = new THREE.TorusGeometry(1.5, 0.04, 16, 64);
      const ringMesh = new THREE.Mesh(ringGeo, glassMaterial);
      this.productGroup.add(ringMesh);
    }
  }

  toggleWireframe() {
    this.isWireframeOnly = !this.isWireframeOnly;
    this.productGroup.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.wireframe = this.isWireframeOnly;
      }
    });
  }

  toggleExplodedView() {
    this.exploded = !this.exploded;
    const factor = this.exploded ? 1.8 : 1.0;
    this.productGroup.traverse(child => {
      if (child.name === 'screen') {
        child.position.y = this.exploded ? 1.2 : 0.45;
      } else if (child.name === 'display') {
        child.position.y = this.exploded ? 1.2 : 0.45;
      } else if (child.name === 'keyboard') {
        child.position.y = this.exploded ? 0.3 : -0.25;
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isDragging) {
      this.productGroup.rotation.y += 0.008;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
