import * as THREE from 'three';

export class HologramCore {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.innerOrb = null;
    this.arcReactorMesh = null;
    this.arcCoils = [];
    this.targetingReticles = [];
    this.orbitalRings = [];
    this.floorGrid = null;
    this.state = 'IDLE'; // IDLE, LISTENING, THINKING, SPEAKING, SCANNING, TACTICAL
    this.clock = new THREE.Clock();
    this.audioPulse = 0.0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    const width = this.canvas.clientWidth || 640;
    const height = this.canvas.clientHeight || 480;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5.0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createCoreElements();

    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    this.animate();
  }

  createCoreElements() {
    // 1. Quantum Particle Swarm (Jarvis Core Sphere) - Scaled Bigger & Denser
    const particleCount = 3400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(0x00f0ff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.55 + Math.random() * 0.95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, pMaterial);
    this.scene.add(this.particles);

    // 2. Wireframe Central Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.05, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.innerOrb = new THREE.Mesh(coreGeo, coreMat);
    this.scene.add(this.innerOrb);

    // 3. Central Arc Reactor Core
    const arcCoreGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32);
    const arcCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    this.arcReactorMesh = new THREE.Mesh(arcCoreGeo, arcCoreMat);
    this.arcReactorMesh.rotation.x = Math.PI / 2;
    this.scene.add(this.arcReactorMesh);

    // Arc Reactor 10 Electromagnetic Copper Coils
    const coilCount = 10;
    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI * 2;
      const coilGeo = new THREE.BoxGeometry(0.12, 0.28, 0.08);
      const coilMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.75
      });
      const coil = new THREE.Mesh(coilGeo, coilMat);
      coil.position.set(Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, 0);
      coil.rotation.z = angle + Math.PI / 2;
      this.arcCoils.push(coil);
      this.scene.add(coil);
    }

    // 4. Mark-Style Concentric Targeting Rings & Reticles
    // Reticle 1: Segmented Inner Target Ring with Cardinal Ticks
    const reticle1Geo = new THREE.RingGeometry(1.85, 1.9, 64);
    const reticle1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const reticle1 = new THREE.Mesh(reticle1Geo, reticle1Mat);
    reticle1.userData = { speed: 0.01, axis: 'z' };
    this.targetingReticles.push(reticle1);
    this.scene.add(reticle1);

    // Reticle 2: Segmented Degree Ticks (Dotted ring simulation)
    const tickCount = 36;
    const tickGroup = new THREE.Group();
    for (let i = 0; i < tickCount; i++) {
      const ang = (i / tickCount) * Math.PI * 2;
      const isMajor = i % 4 === 0;
      const len = isMajor ? 0.18 : 0.08;
      const tGeo = new THREE.PlaneGeometry(0.02, len);
      const tMat = new THREE.MeshBasicMaterial({
        color: isMajor ? 0x00f0ff : 0x0077ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isMajor ? 0.9 : 0.4
      });
      const tick = new THREE.Mesh(tGeo, tMat);
      tick.position.set(Math.cos(ang) * 2.15, Math.sin(ang) * 2.15, 0);
      tick.rotation.z = ang + Math.PI / 2;
      tickGroup.add(tick);
    }
    tickGroup.userData = { speed: -0.006, axis: 'z' };
    this.targetingReticles.push(tickGroup);
    this.scene.add(tickGroup);

    // 5. Tilted Orbital Planetary Rings (as seen in Jarvis AI Core UI)
    const orbitalConfigs = [
      { radius: 2.6, width: 0.03, rotX: 1.1, rotY: 0.3, speed: 0.012, color: 0x00f0ff },
      { radius: 2.9, width: 0.025, rotX: -0.85, rotY: -0.4, speed: -0.009, color: 0x38bdf8 },
      { radius: 3.2, width: 0.02, rotX: 0.4, rotY: 1.2, speed: 0.007, color: 0x00ffaa }
    ];

    orbitalConfigs.forEach(cfg => {
      const ringGeo = new THREE.RingGeometry(cfg.radius, cfg.radius + cfg.width, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = cfg.rotX;
      ring.rotation.y = cfg.rotY;
      ring.userData = cfg;
      this.orbitalRings.push(ring);
      this.scene.add(ring);
    });

    // 6. Base Horizon Particle Disk (Floor grid below globe)
    const floorCount = 600;
    const floorGeo = new THREE.BufferGeometry();
    const floorPos = new Float32Array(floorCount * 3);
    for (let i = 0; i < floorCount; i++) {
      const dist = 1.0 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      floorPos[i * 3] = Math.cos(angle) * dist;
      floorPos[i * 3 + 1] = -2.2 + (Math.random() * 0.15); // Bottom elevation
      floorPos[i * 3 + 2] = Math.sin(angle) * dist;
    }
    floorGeo.setAttribute('position', new THREE.BufferAttribute(floorPos, 3));
    const floorMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.floorGrid = new THREE.Points(floorGeo, floorMat);
    this.scene.add(this.floorGrid);

    // Light
    const ambientLight = new THREE.AmbientLight(0x00f0ff, 0.6);
    this.scene.add(ambientLight);
  }

  setState(newState) {
    this.state = newState;
    let targetColor = 0x00f0ff; // Cyan (IDLE)
    let coreOpacity = 0.4;

    if (newState === 'LISTENING') {
      targetColor = 0xffb800; // Amber
      coreOpacity = 0.7;
    } else if (newState === 'THINKING') {
      targetColor = 0xa855f7; // Purple
      coreOpacity = 0.8;
    } else if (newState === 'SPEAKING') {
      targetColor = 0x00ffaa; // Emerald
      coreOpacity = 0.85;
    } else if (newState === 'SCANNING') {
      targetColor = 0xec4899; // Neon Pink
      coreOpacity = 0.85;
    } else if (newState === 'TACTICAL') {
      targetColor = 0xff2255; // Crimson Red (Stark Alert)
      coreOpacity = 0.95;
    }

    const col = new THREE.Color(targetColor);
    if (this.innerOrb) {
      this.innerOrb.material.color.set(col);
      this.innerOrb.material.opacity = coreOpacity;
    }
    if (this.arcReactorMesh) {
      this.arcReactorMesh.material.color.set(col);
    }
    this.arcCoils.forEach(c => c.material.color.set(col));
    this.targetingReticles.forEach(r => {
      if (r.material) r.material.color.set(col);
      else if (r.children) r.children.forEach(ch => ch.material && ch.material.color.set(col));
    });
    this.orbitalRings.forEach(r => r.material.color.set(col));
    if (this.floorGrid) this.floorGrid.material.color.set(col);
  }

  setAudioPulse(val) {
    this.audioPulse = Math.min(Math.max(val, 0), 1);
  }

  onWindowResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Responsive speed multiplier based on state with larger animation pulses
    let speedMult = 1.25;
    let pulseScale = 1.0 + Math.sin(elapsedTime * 2.8) * 0.08 + (this.audioPulse * 0.42);

    if (this.state === 'LISTENING') {
      speedMult = 2.2;
      pulseScale += 0.18;
    } else if (this.state === 'THINKING') {
      speedMult = 3.6;
      pulseScale += Math.sin(elapsedTime * 9) * 0.14;
    } else if (this.state === 'SPEAKING') {
      speedMult = 2.0;
      pulseScale += Math.sin(elapsedTime * 5.5) * 0.22 + (this.audioPulse * 0.55);
    } else if (this.state === 'TACTICAL') {
      speedMult = 3.0;
      pulseScale += Math.sin(elapsedTime * 10) * 0.18;
    }

    // Interactive slight tilt towards mouse position
    const targetRotX = (this.mouseY * 0.28);
    const targetRotY = (this.mouseX * 0.4);
    this.scene.rotation.x += (targetRotX - this.scene.rotation.x) * 0.06;
    this.scene.rotation.y += (targetRotY - this.scene.rotation.y) * 0.06;

    // 1. Quantum particle sphere rotation
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.15 * speedMult;
      this.particles.rotation.x = elapsedTime * 0.1 * speedMult;
      this.particles.scale.set(pulseScale, pulseScale, pulseScale);
    }

    // 2. Inner wireframe icosahedron
    if (this.innerOrb) {
      this.innerOrb.rotation.y = -elapsedTime * 0.3 * speedMult;
      this.innerOrb.rotation.z = elapsedTime * 0.22 * speedMult;
      this.innerOrb.scale.set(pulseScale * 0.94, pulseScale * 0.94, pulseScale * 0.94);
    }

    // 3. Central Arc Reactor core pulse - Bigger Amplitude
    if (this.arcReactorMesh) {
      const arcScale = 1.0 + Math.sin(elapsedTime * 4.5) * 0.22 + (this.audioPulse * 0.6);
      this.arcReactorMesh.scale.set(arcScale, arcScale, arcScale);
    }

    // Arc Reactor Coils rotation with wider dynamic radius
    this.arcCoils.forEach((coil, idx) => {
      const ang = (idx / this.arcCoils.length) * Math.PI * 2 + (elapsedTime * 0.25 * speedMult);
      const rad = 0.85 + Math.sin(elapsedTime * 3 + idx) * 0.08 + (this.audioPulse * 0.18);
      coil.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, 0);
      coil.rotation.z = ang + Math.PI / 2;
    });

    // 4. Targeting Reticles & Cardinal Ticks rotation
    this.targetingReticles.forEach(ret => {
      const speed = ret.userData.speed || 0.01;
      ret.rotation.z += speed * speedMult;
    });

    // 5. Planetary Orbital Rings
    this.orbitalRings.forEach(ring => {
      const cfg = ring.userData;
      ring.rotation.z += cfg.speed * speedMult;
    });

    // 6. Base Horizon Particle Disk
    if (this.floorGrid) {
      this.floorGrid.rotation.y = -elapsedTime * 0.06 * speedMult;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
