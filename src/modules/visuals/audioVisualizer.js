export class AudioWaveformVisualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.isActive = false;
    this.syntheticWave = false;
    this.syntheticIntensity = 0.5;
    this.phase = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;
    if (this.ctx.setTransform) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  async attachMicrophone() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.isActive = true;
      this.syntheticWave = false;
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted, falling back to simulated neural audio wave', err);
      this.syntheticWave = true;
      return false;
    }
  }

  setSyntheticActivity(active, intensity = 0.5) {
    this.syntheticWave = active;
    this.syntheticIntensity = intensity;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (!width || !height) return;

    this.ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const barCount = 48;
    const barWidth = (width / barCount) * 0.6;
    const gap = (width / barCount) * 0.4;

    this.phase += 0.05;

    let frequencyData = [];

    if (this.isActive && this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      frequencyData = Array.from(this.dataArray);
    } else if (this.syntheticWave) {
      for (let i = 0; i < barCount; i++) {
        const val = Math.sin(this.phase + i * 0.25) * 40 * this.syntheticIntensity +
                    Math.cos(this.phase * 1.5 + i * 0.15) * 30 * this.syntheticIntensity + 20;
        frequencyData.push(Math.max(4, Math.abs(val)));
      }
    } else {
      // Idle gentle idle pulse
      for (let i = 0; i < barCount; i++) {
        const val = Math.sin(this.phase * 0.4 + i * 0.2) * 6 + 4;
        frequencyData.push(val);
      }
    }

    for (let i = 0; i < barCount; i++) {
      const val = frequencyData[i % frequencyData.length] || 10;
      const barHeight = Math.min((val / 255) * height * 0.85 + 3, height * 0.9);

      const x = i * (barWidth + gap) + gap;
      const y = centerY - barHeight / 2;

      // Holographic gradient
      const gradient = this.ctx.createLinearGradient(0, y, 0, y + barHeight);
      if (this.syntheticWave || this.isActive) {
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(0.5, '#0077ff');
        gradient.addColorStop(1, '#00ffaa');
      } else {
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 119, 255, 0.2)');
      }

      this.ctx.fillStyle = gradient;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = this.syntheticWave || this.isActive ? 8 : 2;
      this.ctx.fillRect(x, y, barWidth, barHeight);
    }
  }
}
