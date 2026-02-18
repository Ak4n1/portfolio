import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

type ParticleType = 'float' | 'burst' | 'spark' | 'trail';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: ParticleType;
  decay: number;
  orbitRadius: number;
  seed: number;
}

interface Shockwave {
  radius: number;
  maxRadius: number;
  alpha: number;
  width: number;
}

interface GlitchLine {
  y: number;
  height: number;
  offset: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface OrbitalRing {
  baseRadius: number;
  speed: number;
  angle: number;
  particleAngles: number[];
}

interface HexValue {
  x: number;
  y: number;
  value: string;
  life: number;
  maxLife: number;
  alpha: number;
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

@Component({
  selector: 'app-preloader-v2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader-v2.component.html',
  styleUrl: './preloader-v2.component.css'
})
export class PreloaderV2Component implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() complete = new EventEmitter<void>();
  @Output() exitStarted = new EventEmitter<void>();
  private readonly brandLabel = 'PORTAFOLIO JUAN ENCABO';
  private readonly useCircularRevealWipe = false;

  private ctx: CanvasRenderingContext2D | null = null;
  private dpr = Math.max(1, window.devicePixelRatio || 1);
  private width = 0;
  private height = 0;
  private centerX = 0;
  private centerY = 0;
  private frame = 0;
  private progress = 0;
  private phase = 0;
  private rafId: number | null = null;
  private exitTimerId: number | null = null;
  private hardStopId: number | null = null;
  private themeObserver: MutationObserver | null = null;
  private themeMode: 'dark' | 'light' = 'dark';
  private startedAt = 0;
  private exiting = false;
  private exitScheduled = false;
  private exitProgress = 0;
  private exitEase = 0;
  private finished = false;
  private renderErrored = false;
  private exitNotified = false;
  private nextShockwaveFrame = 120;
  private nextGlitchFrame = 120;
  private particles: Particle[] = [];
  private shockwaves: Shockwave[] = [];
  private glitches: GlitchLine[] = [];
  private rings: OrbitalRing[] = [];
  private hexValues: HexValue[] = [];
  private mouse: PointerState = { x: 0, y: 0, active: false };

  private readonly onResize = (): void => {
    this.resizeCanvas();
  };

  private readonly onMouseMove = (event: MouseEvent): void => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    this.mouse.active = true;
  };

  private readonly onMouseOut = (event: MouseEvent): void => {
    if (!event.relatedTarget) this.mouse.active = false;
  };

  private readonly onBlur = (): void => {
    this.mouse.active = false;
  };

  private readonly animate = (): void => {
    if (!this.ctx || this.finished) return;
    try {
      const elapsed = performance.now() - this.startedAt;
      if (elapsed > 12500) {
        this.finish();
        return;
      }

      this.frame += 1;

      if (this.exiting) {
        this.exitProgress = Math.min(1, this.exitProgress + 0.012);
        this.exitEase = this.easeInOutCubic(this.exitProgress);
      }

      this.updateProgressAndPhase();
      this.spawnSystems();
      this.updateRings();
      this.updateParticles();
      this.updateShockwaves();
      this.updateGlitches();
      this.updateHexValues();
      this.render();

      if (this.exiting && this.exitProgress >= 1) {
        this.finish();
        return;
      }

      this.rafId = window.requestAnimationFrame(this.animate);
    } catch (error) {
      if (!this.renderErrored) {
        this.renderErrored = true;
        console.error('[PreloaderV2] Render loop error:', error);
      }
      this.finish();
    }
  };

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.resolveThemeMode();
    this.observeThemeChanges();

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      this.finish();
      return;
    }

    this.ctx = context;
    this.startedAt = performance.now();
    this.setupRings();
    this.resizeCanvas();
    this.seedFloaters(80);

    this.nextShockwaveFrame = this.frame + 120;
    this.nextGlitchFrame = this.frame + this.randomInt(90, 150);

    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mouseout', this.onMouseOut, { passive: true });
    window.addEventListener('blur', this.onBlur, { passive: true });

    // Fail-safe: nunca dejar la app bloqueada en overlay.
    this.hardStopId = window.setTimeout(() => this.finish(), 14000);

    this.ngZone.runOutsideAngular(() => {
      this.rafId = window.requestAnimationFrame(this.animate);
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.exitTimerId !== null) {
      window.clearTimeout(this.exitTimerId);
      this.exitTimerId = null;
    }

    if (this.hardStopId !== null) {
      window.clearTimeout(this.hardStopId);
      this.hardStopId = null;
    }

    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseout', this.onMouseOut);
    window.removeEventListener('blur', this.onBlur);
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.cleanup();

    this.ngZone.run(() => {
      this.complete.emit();
    });
  }

  private resizeCanvas(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.max(1, window.devicePixelRatio || 1);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width * 0.5;
    this.centerY = this.height * 0.5;

    canvas.width = Math.floor(this.width * this.dpr);
    canvas.height = Math.floor(this.height * this.dpr);
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.fillStyle = this.themeMode === 'light' ? '#f4f7fa' : '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private setupRings(): void {
    const configs = [
      { baseRadius: 120, speed: 0.008, count: 8 },
      { baseRadius: 180, speed: -0.005, count: 12 },
      { baseRadius: 240, speed: 0.003, count: 16 }
    ];

    this.rings = configs.map((cfg) => {
      const particleAngles: number[] = [];
      for (let i = 0; i < cfg.count; i += 1) {
        particleAngles.push((Math.PI * 2 * i) / cfg.count);
      }
      return {
        baseRadius: cfg.baseRadius,
        speed: cfg.speed,
        angle: Math.random() * Math.PI * 2,
        particleAngles
      };
    });
  }

  private updateProgressAndPhase(): void {
    if (!this.exiting) {
      if (this.progress < 30) {
        this.progress += 0.6;
      } else if (this.progress < 70) {
        this.progress += 0.3;
      } else if (this.progress < 90) {
        this.progress += 0.16;
      } else if (this.progress < 100) {
        this.progress += 0.08;
      }

      if (this.progress >= 100) {
        this.progress = 100;
        if (!this.exitScheduled) {
          this.exitScheduled = true;
          this.exitTimerId = window.setTimeout(() => this.startExit(), 400);
        }
      }
    }

    if (this.progress > 80) this.phase = 3;
    else if (this.progress > 50) this.phase = 2;
    else if (this.progress > 25) this.phase = 1;
    else this.phase = 0;
  }

  private startExit(): void {
    if (this.exiting || this.finished) return;

    this.exiting = true;
    this.exitProgress = 0;
    this.exitEase = 0;

    if (!this.exitNotified) {
      this.exitNotified = true;
      this.ngZone.run(() => this.exitStarted.emit());
    }

    this.spawnMassiveShockwave(600, 2.8);
    this.spawnMassiveShockwave(800, 3.6);
    this.spawnMassiveShockwave(1000, 4.4);
    this.spawnBurstParticles(80, 4, 10);
    this.spawnSparkParticles(40, 2, 6);
  }

  private spawnSystems(): void {
    const floaters = this.countParticlesByType('float');
    if (floaters < 120) this.seedFloaters(Math.min(4, 120 - floaters));

    if (!this.exiting && this.phase >= 1 && this.frame >= this.nextShockwaveFrame) {
      this.spawnShockwave();
      this.spawnBurstParticles(30, 2, 6);
      this.nextShockwaveFrame = this.frame + 120;
    }

    if (!this.exiting && this.phase >= 2 && this.frame % 60 === 0) {
      this.spawnSparkParticles(12, 1, 3);
    }

    if (!this.exiting && this.phase >= 2 && this.frame >= this.nextGlitchFrame) {
      this.spawnGlitches(this.randomInt(3, 7), 24);
      this.nextGlitchFrame = this.frame + this.randomInt(90, 150);
    }

    if (!this.exiting && this.phase >= 2 && this.frame % 120 === 0) {
      this.spawnHexValues(6);
    }

    if (this.exiting && this.exitEase < 0.6 && Math.random() < 0.4) {
      this.spawnGlitches(this.randomInt(6, 16), 60);
    }
  }

  private updateRings(): void {
    if (this.phase < 1 && !this.exiting) return;
    const speedBoost = this.exiting ? 1 + this.exitEase * 10 : 1;

    for (const ring of this.rings) {
      ring.angle += ring.speed * speedBoost;
      for (let i = 0; i < ring.particleAngles.length; i += 1) {
        ring.particleAngles[i] += ring.speed * 1.2 * speedBoost;
      }
    }
  }

  private updateParticles(): void {
    const retained: Particle[] = [];
    const trailSpawnQueue: Particle[] = [];

    for (const particle of this.particles) {
      particle.life += 1;
      const lifeRatio = particle.life / particle.maxLife;
      particle.alpha = this.computeLifeAlpha(lifeRatio);

      if (particle.type === 'float') this.updateFloatParticle(particle);
      else this.updateTransientParticle(particle);

      this.applyMouseRepulsion(particle);
      particle.x += particle.vx;
      particle.y += particle.vy;

      if ((particle.type === 'burst' || particle.type === 'spark') && Math.random() < 0.28) {
        trailSpawnQueue.push(this.createTrailParticle(particle));
      }

      if (this.shouldKeepParticle(particle)) retained.push(particle);
    }

    this.particles = retained.concat(trailSpawnQueue);
  }

  private updateFloatParticle(particle: Particle): void {
    const dx = this.centerX - particle.x;
    const dy = this.centerY - particle.y;
    const dist = Math.max(0.001, Math.hypot(dx, dy));
    const toCenterX = dx / dist;
    const toCenterY = dy / dist;
    const tangentX = -toCenterY;
    const tangentY = toCenterX;
    const radialForce = (particle.orbitRadius - dist) * 0.0018;

    particle.vx += tangentX * 0.024 + toCenterX * radialForce;
    particle.vy += tangentY * 0.024 + toCenterY * radialForce;

    const driftA = Math.sin((this.frame + particle.seed) * 0.01) * 0.002;
    const driftB = Math.cos((this.frame + particle.seed) * 0.013) * 0.002;
    particle.vx += driftA;
    particle.vy += driftB;

    if (this.exiting) {
      const outwardForce = 0.08 * this.exitEase;
      particle.vx += -toCenterX * outwardForce;
      particle.vy += -toCenterY * outwardForce;
    }

    particle.vx *= particle.decay;
    particle.vy *= particle.decay;
  }

  private updateTransientParticle(particle: Particle): void {
    if (this.exiting && (particle.type === 'burst' || particle.type === 'spark')) {
      particle.vx *= 1.03;
      particle.vy *= 1.03;
    }

    particle.vx *= particle.decay;
    particle.vy *= particle.decay;
  }

  private applyMouseRepulsion(particle: Particle): void {
    if (!this.mouse.active) return;

    const dx = particle.x - this.mouse.x;
    const dy = particle.y - this.mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 0.0001 || dist >= 120) return;

    const force = ((120 - dist) / 120) * 0.5;
    particle.vx += (dx / dist) * force;
    particle.vy += (dy / dist) * force;
  }

  private shouldKeepParticle(particle: Particle): boolean {
    if (particle.life >= particle.maxLife) return false;
    if (particle.alpha <= 0.001) return false;

    const margin = particle.type === 'float' ? 240 : 180;
    if (particle.x < -margin || particle.x > this.width + margin) return false;
    if (particle.y < -margin || particle.y > this.height + margin) return false;

    return true;
  }

  private updateShockwaves(): void {
    const retained: Shockwave[] = [];
    for (const wave of this.shockwaves) {
      wave.radius += 3;
      wave.alpha *= 0.97;
      if (wave.alpha > 0.01 && wave.radius < wave.maxRadius) retained.push(wave);
    }
    this.shockwaves = retained;
  }

  private updateGlitches(): void {
    const retained: GlitchLine[] = [];
    for (const glitch of this.glitches) {
      glitch.life -= 1;
      glitch.alpha *= 0.96;
      glitch.offset *= 0.92;
      if (glitch.life > 0 && glitch.alpha > 0.02) retained.push(glitch);
    }
    this.glitches = retained;
  }

  private updateHexValues(): void {
    const retained: HexValue[] = [];
    for (const value of this.hexValues) {
      value.life -= 1;
      value.y -= 0.22;
      value.alpha = Math.max(0, value.life / value.maxLife);
      if (value.life > 0) retained.push(value);
    }
    this.hexValues = retained;
  }

  private render(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const fadeMultiplier = Math.max(0, 1 - this.exitEase);
    const clearAlpha = this.exiting
      ? Math.max(0.02, 0.12 * (1 - this.exitEase))
      : 0.12;

    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      const opacity = this.exiting ? Math.max(0, 1 - this.exitEase * 1.35) : 1;
      canvas.style.opacity = opacity.toFixed(3);
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.bgColor(clearAlpha);
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawBackgroundGlow(fadeMultiplier);

    if (this.phase >= 1 || this.exiting) this.drawGrid(fadeMultiplier);

    this.drawFloatConnections(fadeMultiplier);

    if (this.phase >= 1 || this.exiting) this.drawOrbitalRings(fadeMultiplier);
    if (this.phase >= 1 || this.exiting) this.drawShockwaves(fadeMultiplier);

    this.drawParticles(fadeMultiplier);
    this.drawMorphicCore(fadeMultiplier);

    if (this.phase >= 1 || this.exiting) this.drawScanline(fadeMultiplier);
    if (this.phase >= 2 || this.exiting) this.drawGlitches(fadeMultiplier);

    this.drawMouseGlow(fadeMultiplier);
    this.drawHud(fadeMultiplier);
    this.drawProgressBar(fadeMultiplier);
    this.drawVignette(fadeMultiplier);

    if (this.exiting && this.exitEase < 0.15) this.drawExitFlash(fadeMultiplier);
    if (this.useCircularRevealWipe && this.exiting && this.exitEase > 0.3) {
      this.drawDissolveWipe();
    }
  }

  private drawBackgroundGlow(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const pulse = 0.08 + ((Math.sin(this.frame * 0.02) + 1) * 0.5) * 0.05;
    const radius = Math.min(this.width, this.height) * 0.65;
    const gradient = this.ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, radius);
    gradient.addColorStop(0, `rgba(2, 163, 126, ${pulse * fadeMultiplier})`);
    gradient.addColorStop(1, 'rgba(2, 163, 126, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawGrid(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const spacing = 60;
    const offset = (this.frame * 0.4) % spacing;
    const alpha = 0.04 * fadeMultiplier * (this.phase >= 3 ? 1 : 0.85);

    this.ctx.strokeStyle = this.themeMode === 'light'
      ? this.neutralColor(alpha * 0.55)
      : `rgba(2, 163, 126, ${alpha})`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    for (let x = -spacing + offset; x < this.width + spacing; x += spacing) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }

    for (let y = -spacing + offset; y < this.height + spacing; y += spacing) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }

    this.ctx.stroke();
  }

  private drawFloatConnections(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const floaters = this.particles.filter((particle) => particle.type === 'float' && particle.alpha > 0.3);
    const maxDist = 100;
    const maxDistSq = maxDist * maxDist;

    for (let i = 0; i < floaters.length; i += 1) {
      const a = floaters[i];
      for (let j = i + 1; j < floaters.length; j += 1) {
        const b = floaters[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= maxDistSq) continue;

        const dist = Math.sqrt(distSq);
        const alpha = (1 - dist / maxDist) * 0.12 * a.alpha * b.alpha * fadeMultiplier;

        this.ctx.strokeStyle = `rgba(2, 163, 126, ${alpha})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.stroke();
      }
    }
  }

  private drawOrbitalRings(fadeMultiplier: number): void {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.setLineDash([8, 16]);
    this.ctx.lineWidth = 1.2;

    for (let i = 0; i < this.rings.length; i += 1) {
      const ring = this.rings[i];
      const breathe = 1 + Math.sin(this.frame * 0.02 + i * 0.8) * 0.05;
      const growth = 0.5 + this.progress * 0.005;
      const exitScale = this.exiting ? 1 + this.exitEase * 8 : 1;
      const rx = ring.baseRadius * breathe * growth * exitScale;
      const ry = rx * 0.35;

      const alpha = (0.18 + i * 0.04) * fadeMultiplier;
      this.ctx.strokeStyle = `rgba(2, 163, 126, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.ellipse(this.centerX, this.centerY, rx, ry, ring.angle, 0, Math.PI * 2);
      this.ctx.stroke();

      for (const angle of ring.particleAngles) {
        const ex = Math.cos(angle) * rx;
        const ey = Math.sin(angle) * ry;
        const rotCos = Math.cos(ring.angle);
        const rotSin = Math.sin(ring.angle);
        const px = this.centerX + ex * rotCos - ey * rotSin;
        const py = this.centerY + ex * rotSin + ey * rotCos;

        const glow = this.ctx.createRadialGradient(px, py, 0, px, py, 8);
        glow.addColorStop(0, `rgba(2, 163, 126, ${0.5 * fadeMultiplier})`);
        glow.addColorStop(1, 'rgba(2, 163, 126, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = `rgba(2, 163, 126, ${0.9 * fadeMultiplier})`;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 1.25, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }

  private drawShockwaves(fadeMultiplier: number): void {
    if (!this.ctx) return;

    for (const wave of this.shockwaves) {
      const alpha = wave.alpha * fadeMultiplier;

      this.ctx.strokeStyle = `rgba(2, 163, 126, ${alpha})`;
      this.ctx.lineWidth = wave.width;
      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, wave.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = `rgba(2, 163, 126, ${alpha * 0.4})`;
      this.ctx.lineWidth = Math.max(1, wave.width * 0.7);
      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, wave.radius * 0.7, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  private drawParticles(fadeMultiplier: number): void {
    if (!this.ctx) return;

    for (const particle of this.particles) {
      const alpha = particle.alpha * fadeMultiplier;
      if (alpha <= 0.001) continue;

      const glowScale = particle.type === 'burst'
        ? 8
        : particle.type === 'spark'
          ? 6
          : particle.type === 'trail'
            ? 5
            : 5.5;

      const glowRadius = particle.size * glowScale;
      const gradient = this.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowRadius);
      gradient.addColorStop(0, `rgba(2, 163, 126, ${0.4 * alpha})`);
      gradient.addColorStop(1, 'rgba(2, 163, 126, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = `rgba(2, 163, 126, ${0.95 * alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, Math.max(0.65, particle.size), 0, Math.PI * 2);
      this.ctx.fill();

      if (particle.type === 'burst' || particle.type === 'spark') {
        this.ctx.fillStyle = this.themeMode === 'light'
          ? this.neutralColor(0.9 * alpha)
          : `rgba(255, 255, 255, ${0.9 * alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, Math.max(0.45, particle.size * 0.42), 0, Math.PI * 2);
        this.ctx.fill();
      }

      if (particle.type === 'burst') {
        this.ctx.strokeStyle = `rgba(2, 163, 126, ${0.35 * alpha})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(particle.x - particle.vx * 6, particle.y - particle.vy * 6);
        this.ctx.stroke();
      }
    }
  }

  private drawMorphicCore(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const rotationBase = this.frame * 0.004 + this.exitEase * Math.PI * 4;
    let baseRadius = 50 + Math.sin(this.frame * 0.01) * 10;
    baseRadius *= Math.max(0, 1 - this.exitEase * 2.5);

    const coreGlow = this.ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, baseRadius * 3);
    coreGlow.addColorStop(0, `rgba(2, 163, 126, ${0.22 * fadeMultiplier})`);
    coreGlow.addColorStop(1, 'rgba(2, 163, 126, 0)');
    this.ctx.fillStyle = coreGlow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const layers = [
      { scale: 1, alpha: 0.6 },
      { scale: 0.85, alpha: 0.3 },
      { scale: 0.7, alpha: 0.15 },
      { scale: 0.55, alpha: 0.05 }
    ];

    for (let layerIndex = 0; layerIndex < layers.length; layerIndex += 1) {
      const layer = layers[layerIndex];
      const radius = baseRadius * layer.scale;
      this.ctx.beginPath();

      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2 + rotationBase;
        const morph = 1
          + Math.sin(angle * 3 + this.frame * 0.04) * 0.15
          + Math.sin(angle * 5 + this.frame * 0.06) * 0.08;
        const r = radius * morph;
        const x = this.centerX + Math.cos(angle) * r;
        const y = this.centerY + Math.sin(angle) * r;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }

      this.ctx.closePath();
      this.ctx.strokeStyle = `rgba(2, 163, 126, ${layer.alpha * fadeMultiplier})`;
      this.ctx.lineWidth = layerIndex === 0 ? 1.5 : 1;
      this.ctx.stroke();

      if (layerIndex === 0) {
        this.ctx.fillStyle = `rgba(2, 163, 126, ${0.06 * fadeMultiplier})`;
        this.ctx.fill();
      }
    }

    const triangleRotation = -rotationBase * 1.5;
    const triRadius = Math.max(0, baseRadius * 0.34);
    this.ctx.beginPath();
    for (let i = 0; i < 3; i += 1) {
      const angle = triangleRotation + (Math.PI * 2 * i) / 3;
      const x = this.centerX + Math.cos(angle) * triRadius;
      const y = this.centerY + Math.sin(angle) * triRadius;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = `rgba(2, 163, 126, ${0.45 * fadeMultiplier})`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    const dotRadius = 3 + Math.sin(this.frame * 0.08) * 1.5;
    const dotGlow = this.ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, 16);
    dotGlow.addColorStop(0, `rgba(2, 163, 126, ${0.9 * fadeMultiplier})`);
    dotGlow.addColorStop(1, 'rgba(2, 163, 126, 0)');
    this.ctx.fillStyle = dotGlow;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 16, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = this.themeMode === 'light'
      ? this.neutralColor(0.88 * fadeMultiplier)
      : `rgba(255, 255, 255, ${0.85 * fadeMultiplier})`;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, Math.max(1.2, dotRadius), 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawScanline(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const bandHeight = 60;
    const y = (this.frame * 2) % (this.height + bandHeight * 2) - bandHeight;
    const gradient = this.ctx.createLinearGradient(0, y, 0, y + bandHeight);
    gradient.addColorStop(0, 'rgba(2, 163, 126, 0)');
    gradient.addColorStop(0.5, `rgba(2, 163, 126, ${0.1 * fadeMultiplier})`);
    gradient.addColorStop(1, 'rgba(2, 163, 126, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, y, this.width, bandHeight);
  }

  private drawGlitches(fadeMultiplier: number): void {
    if (!this.ctx) return;

    for (const glitch of this.glitches) {
      const lifeRatio = glitch.life / glitch.maxLife;
      const alpha = glitch.alpha * lifeRatio * fadeMultiplier;
      this.ctx.fillStyle = `rgba(2, 163, 126, ${alpha})`;
      this.ctx.fillRect(glitch.offset, glitch.y, this.width, glitch.height);
      this.ctx.fillStyle = this.themeMode === 'light'
        ? this.neutralColor(alpha * 0.32)
        : `rgba(255, 255, 255, ${alpha * 0.35})`;
      this.ctx.fillRect(-glitch.offset * 0.35, glitch.y + glitch.height * 0.25, this.width, 1);
    }
  }

  private drawMouseGlow(fadeMultiplier: number): void {
    if (!this.ctx || !this.mouse.active) return;

    const gradient = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 150);
    gradient.addColorStop(0, `rgba(2, 163, 126, ${0.06 * fadeMultiplier})`);
    gradient.addColorStop(1, 'rgba(2, 163, 126, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 150, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawHud(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const pad = 30;
    const l = 20;
    const shift = this.exitEase * 80;

    this.ctx.strokeStyle = `rgba(2, 163, 126, ${0.5 * fadeMultiplier})`;
    this.ctx.lineWidth = 1.5;

    this.ctx.beginPath();
    this.ctx.moveTo(pad - shift, pad - shift + l);
    this.ctx.lineTo(pad - shift, pad - shift);
    this.ctx.lineTo(pad - shift + l, pad - shift);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.width - pad + shift - l, pad - shift);
    this.ctx.lineTo(this.width - pad + shift, pad - shift);
    this.ctx.lineTo(this.width - pad + shift, pad - shift + l);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(pad - shift, this.height - pad + shift - l);
    this.ctx.lineTo(pad - shift, this.height - pad + shift);
    this.ctx.lineTo(pad - shift + l, this.height - pad + shift);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.width - pad + shift - l, this.height - pad + shift);
    this.ctx.lineTo(this.width - pad + shift, this.height - pad + shift);
    this.ctx.lineTo(this.width - pad + shift, this.height - pad + shift - l);
    this.ctx.stroke();

    this.ctx.font = '9px "Courier New", monospace';
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = `rgba(2, 163, 126, ${0.8 * fadeMultiplier})`;
    this.ctx.fillText(`SYS.INIT_${Math.floor(this.progress).toString().padStart(3, '0')}`, 24 - shift, 16 - shift);

    const memoryValue = 24 + Math.sin(this.frame * 0.025) * 5 + this.particles.length * 0.03;
    this.ctx.fillText(`MEM: ${memoryValue.toFixed(1)}MB`, 24 - shift, 29 - shift);

    this.ctx.textAlign = 'right';
    this.ctx.fillText(`FRM: ${this.frame}`, this.width - 24 + shift, 16 - shift);
    this.ctx.fillText(`PTC: ${this.particles.length}`, this.width - 24 + shift, 29 - shift);
    this.ctx.textAlign = 'left';

    if (this.phase >= 2 || this.exiting) {
      this.ctx.fillStyle = `rgba(2, 163, 126, ${0.45 * fadeMultiplier})`;
      for (const value of this.hexValues) {
        this.ctx.globalAlpha = value.alpha * fadeMultiplier;
        this.ctx.fillText(value.value, value.x, value.y);
      }
      this.ctx.globalAlpha = 1;
    }
  }

  private drawProgressBar(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const width = 240;
    const height = 2;
    const x = this.centerX - width * 0.5;
    const y = this.centerY + 110 + this.exitEase * 60;
    const fillWidth = width * (this.progress / 100);

    const brandPulse = 0.68 + ((Math.sin(this.frame * 0.045) + 1) * 0.5) * 0.32;
    this.ctx.fillStyle = this.themeMode === 'light'
      ? this.neutralColor(brandPulse * fadeMultiplier)
      : `rgba(230, 255, 250, ${brandPulse * fadeMultiplier})`;
    this.ctx.font = '700 15px "Courier New", monospace';
    this.ctx.textBaseline = 'middle';
    this.drawTrackedText(this.brandLabel, this.centerX, y - 38, 2.2, 'center');

    this.ctx.fillStyle = `rgba(2, 163, 126, ${0.08 * fadeMultiplier})`;
    this.ctx.fillRect(x, y, width, height);

    const fillGradient = this.ctx.createLinearGradient(x, y, x + width, y);
    fillGradient.addColorStop(0, `rgba(2, 163, 126, ${0.3 * fadeMultiplier})`);
    fillGradient.addColorStop(0.5, `rgba(230, 255, 250, ${1.0 * fadeMultiplier})`);
    fillGradient.addColorStop(1, `rgba(180, 255, 240, ${0.9 * fadeMultiplier})`);
    this.ctx.fillStyle = fillGradient;
    this.ctx.fillRect(x, y, fillWidth, height);

    const tipX = x + fillWidth;
    const tipGlow = this.ctx.createRadialGradient(tipX, y + height * 0.5, 0, tipX, y + height * 0.5, 20);
    tipGlow.addColorStop(0, `rgba(2, 163, 126, ${0.5 * fadeMultiplier})`);
    tipGlow.addColorStop(1, 'rgba(2, 163, 126, 0)');
    this.ctx.fillStyle = tipGlow;
    this.ctx.beginPath();
    this.ctx.arc(tipX, y + height * 0.5, 20, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = `rgba(2, 163, 126, ${0.5 * fadeMultiplier})`;
    this.ctx.fillRect(x, y - 3, 1, 8);
    this.ctx.fillRect(x + width - 1, y - 3, 1, 8);

    const labelPulse = 0.65 + ((Math.sin(this.frame * 0.09) + 1) * 0.5) * 0.35;
    this.ctx.fillStyle = `rgba(2, 163, 126, ${labelPulse * fadeMultiplier})`;
    this.ctx.font = '10px "Courier New", monospace';
    this.ctx.textBaseline = 'middle';
    this.drawTrackedText(this.exiting ? 'COMPLETE' : 'LOADING', this.centerX, y - 14, 6, 'center');

    const percentagePulse = 0.7 + ((Math.sin(this.frame * 0.08) + 1) * 0.5) * 0.3;
    this.ctx.fillStyle = this.themeMode === 'light'
      ? this.neutralColor(percentagePulse * fadeMultiplier)
      : `rgba(245, 255, 252, ${percentagePulse * fadeMultiplier})`;
    this.ctx.font = '13px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${Math.floor(this.progress)}%`, this.centerX, y + 18);
    this.ctx.textAlign = 'left';
  }

  private drawVignette(fadeMultiplier: number): void {
    if (!this.ctx) return;

    const inner = this.height * 0.3;
    const outer = Math.max(this.width, this.height) * 0.8;
    const vignette = this.ctx.createRadialGradient(this.centerX, this.centerY, inner, this.centerX, this.centerY, outer);
    if (this.themeMode === 'light') {
      vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vignette.addColorStop(1, `rgba(228, 233, 238, ${0.62 * fadeMultiplier})`);
    } else {
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, `rgba(0, 0, 0, ${0.6 * fadeMultiplier})`);
    }
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawExitFlash(fadeMultiplier: number): void {
    if (!this.ctx) return;
    const local = 1 - this.exitEase / 0.15;
    const alpha = Math.max(0, Math.min(0.4, local * 0.4)) * fadeMultiplier;
    this.ctx.fillStyle = `rgba(2, 163, 126, ${alpha})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawDissolveWipe(): void {
    if (!this.ctx) return;

    const wipeProgress = (this.exitEase - 0.3) / 0.7;
    const diagonal = Math.hypot(this.width, this.height);
    const radius = Math.max(0, wipeProgress * diagonal * 0.6);
    const softEdge = 80;
    const innerRadius = Math.max(0, radius - softEdge);

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';

    const gradient = this.ctx.createRadialGradient(this.centerX, this.centerY, innerRadius, this.centerX, this.centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  private drawTrackedText(text: string, x: number, y: number, tracking: number, align: CanvasTextAlign = 'left'): void {
    if (!this.ctx) return;

    const previousAlign = this.ctx.textAlign;
    const totalWidth = this.measureTrackedText(text, tracking);
    let startX = x;

    if (align === 'center') startX = x - totalWidth * 0.5;
    else if (align === 'right' || align === 'end') startX = x - totalWidth;

    this.ctx.textAlign = 'left';
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      this.ctx.fillText(char, startX, y);
      startX += this.ctx.measureText(char).width + tracking;
    }
    this.ctx.textAlign = previousAlign;
  }

  private measureTrackedText(text: string, tracking: number): number {
    if (!this.ctx || text.length === 0) return 0;

    let width = 0;
    for (let i = 0; i < text.length; i += 1) {
      width += this.ctx.measureText(text[i]).width;
      if (i < text.length - 1) width += tracking;
    }
    return width;
  }

  private spawnShockwave(): void {
    this.shockwaves.push({
      radius: 0,
      maxRadius: this.randomRange(200, 350),
      alpha: 0.6,
      width: this.randomRange(2, 4)
    });
  }

  private spawnMassiveShockwave(maxRadius: number, width: number): void {
    this.shockwaves.push({
      radius: 0,
      maxRadius,
      alpha: 0.6,
      width
    });
  }

  private seedFloaters(count: number): void {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.randomRange(80, Math.min(this.width, this.height) * 0.45);
      const x = this.centerX + Math.cos(angle) * radius;
      const y = this.centerY + Math.sin(angle) * radius;
      const tangentialSpeed = this.randomRange(0.2, 0.8);

      this.particles.push({
        x,
        y,
        vx: -Math.sin(angle) * tangentialSpeed,
        vy: Math.cos(angle) * tangentialSpeed,
        size: this.randomRange(1.1, 2.5),
        alpha: 0,
        life: 0,
        maxLife: this.randomRange(320, 680),
        type: 'float',
        decay: 0.985,
        orbitRadius: radius,
        seed: Math.random() * 1000
      });
    }
  }

  private spawnBurstParticles(count: number, minSpeed: number, maxSpeed: number): void {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.randomRange(minSpeed, maxSpeed);
      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.randomRange(1.2, 2.9),
        alpha: 0,
        life: 0,
        maxLife: this.randomRange(40, 90),
        type: 'burst',
        decay: 0.96,
        orbitRadius: 0,
        seed: Math.random() * 1000
      });
    }
  }

  private spawnSparkParticles(count: number, minSpeed: number, maxSpeed: number): void {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.randomRange(minSpeed, maxSpeed);
      this.particles.push({
        x: this.centerX + Math.cos(angle) * this.randomRange(20, 55),
        y: this.centerY + Math.sin(angle) * this.randomRange(20, 55),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.randomRange(0.9, 2),
        alpha: 0,
        life: 0,
        maxLife: this.randomRange(28, 70),
        type: 'spark',
        decay: 0.94,
        orbitRadius: 0,
        seed: Math.random() * 1000
      });
    }
  }

  private createTrailParticle(source: Particle): Particle {
    return {
      x: source.x,
      y: source.y,
      vx: -source.vx * 0.2 + this.randomRange(-0.25, 0.25),
      vy: -source.vy * 0.2 + this.randomRange(-0.25, 0.25),
      size: Math.max(0.6, source.size * 0.55),
      alpha: 0,
      life: 0,
      maxLife: this.randomRange(16, 34),
      type: 'trail',
      decay: 0.9,
      orbitRadius: 0,
      seed: Math.random() * 1000
    };
  }

  private spawnGlitches(count: number, offset: number): void {
    for (let i = 0; i < count; i += 1) {
      const maxLife = this.randomInt(4, 10);
      this.glitches.push({
        y: this.randomRange(0, this.height),
        height: this.randomRange(1, 4),
        offset: this.randomRange(-offset, offset),
        alpha: this.randomRange(0.3, 0.7),
        life: maxLife,
        maxLife
      });
    }
  }

  private spawnHexValues(count: number): void {
    for (let i = 0; i < count; i += 1) {
      const value = `0x${this.randomInt(0, 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`;
      this.hexValues.push({
        x: this.randomRange(this.width * 0.15, this.width * 0.85),
        y: this.randomRange(this.height * 0.2, this.height * 0.85),
        value,
        life: 80,
        maxLife: 80,
        alpha: 1
      });
    }
  }

  private countParticlesByType(type: ParticleType): number {
    let total = 0;
    for (const particle of this.particles) {
      if (particle.type === type) total += 1;
    }
    return total;
  }

  private computeLifeAlpha(progress: number): number {
    if (progress <= 0.1) return progress / 0.1;
    if (progress >= 0.7) return Math.max(0, 1 - (progress - 0.7) / 0.3);
    return 1;
  }

  private easeInOutCubic(p: number): number {
    if (p < 0.5) return 4 * p * p * p;
    return 1 - Math.pow(-2 * p + 2, 3) / 2;
  }

  private randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.randomRange(min, max + 1));
  }

  private resolveThemeMode(): void {
    const attrTheme = document.body?.getAttribute('data-theme');
    if (attrTheme === 'light' || attrTheme === 'dark') {
      this.themeMode = attrTheme;
      return;
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      this.themeMode = storedTheme;
      return;
    }

    this.themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private observeThemeChanges(): void {
    if (!document.body) return;

    this.themeObserver = new MutationObserver(() => {
      const previous = this.themeMode;
      this.resolveThemeMode();
      if (previous !== this.themeMode && this.ctx) {
        this.resizeCanvas();
      }
    });

    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  private bgColor(alpha: number): string {
    return this.themeMode === 'light'
      ? `rgba(244, 247, 250, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`;
  }

  private neutralColor(alpha: number): string {
    return this.themeMode === 'light'
      ? `rgba(30, 38, 40, ${alpha})`
      : `rgba(255, 255, 255, ${alpha})`;
  }
}
