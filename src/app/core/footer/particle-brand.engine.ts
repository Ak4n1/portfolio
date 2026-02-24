declare const THREE: any;

export interface ParticleBrandOptions {
  texts?: string[];
  total?: number;
  interval?: number;
  color?: number;
  shadowColor?: number;  // color de la sombra, por defecto igual al color principal
}

export class ParticleBrandEngine {
  private container: HTMLElement;
  private texts: string[];
  private total: number;
  private interval: number;
  private color: number;
  private shadowColor: number;

  private renderer: any;
  private scene: any;
  private camera: any;
  private geo: any;
  private pos!: Float32Array;
  private mat: any;
  private _smat: any;
  private _sgeo: any;
  private _spos!: Float32Array;

  private targets: { x: number; y: number }[] = [];
  private textIdx = 0;
  private disperse = false;
  private pendingNext = false;
  private mouse = { x: 0, y: 0 };
  private raf = 0;
  private timer: any;
  private ro!: ResizeObserver;
  private dead = false;

  private _down!: (e: MouseEvent) => void;
  private _up!: (e: MouseEvent) => void;
  private _move!: (e: MouseEvent) => void;
  private _ctx!: (e: Event) => void;

  // Tamaño actual del canvas/escena
  private W = 0;
  private H = 0;

  constructor(container: HTMLElement, opts: ParticleBrandOptions = {}) {
    this.container = container;
    this.texts    = opts.texts    ?? ['Ak4n1', 'Juan Encabo'];
    this.total    = opts.total    ?? 4000;
    this.interval = opts.interval ?? 10000;
    this.color       = opts.color       ?? 0x00ffc3;
    this.shadowColor  = opts.shadowColor  ?? opts.color ?? 0x00ffc3;
    this._boot();
  }

  private _boot(): void {
    // Leer tamaño real del contenedor
    const rect = this.container.getBoundingClientRect();
    this.W = Math.floor(rect.width)  || 300;
    this.H = Math.floor(rect.height) || 80;

    /* Three.js */
    this.scene = new THREE.Scene();
    // Cámara ortográfica: 1 unidad THREE = 1 pixel CSS
    this.camera = new THREE.OrthographicCamera(
      -this.W / 2, this.W / 2,
       this.H / 2, -this.H / 2,
      -100, 100
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.W, this.H, false); // false = no tocar el CSS del canvas
    this.container.appendChild(this.renderer.domElement);

    // Forzar tamaño CSS del canvas igual al contenedor
    const cv = this.renderer.domElement;
    cv.style.width  = this.W + 'px';
    cv.style.height = this.H + 'px';
    cv.style.display = 'block';

    /* Geometría */
    this.geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(this.total * 3);
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.mat = new THREE.PointsMaterial({
      color: this.color,
      size: 1.6,
      map: this._dot(false),
      transparent: true,
      depthWrite: false,
    });
    this.scene.add(new THREE.Points(this.geo, this.mat));

    /* Sombra */
    const sgeo = new THREE.BufferGeometry();
    const spos = new Float32Array(this.total * 3);
    sgeo.setAttribute('position', new THREE.BufferAttribute(spos, 3));
    this._spos = spos;
    this._sgeo = sgeo;
    this._smat = new THREE.PointsMaterial({
      color: this.shadowColor,
      size: 3.2,
      map: this._dot(true),
      transparent: true,
      depthWrite: false,
      opacity: 0.28,
    });
    this.scene.add(new THREE.Points(sgeo, this._smat));

    /* Posición inicial */
    this.targets = this._sample(this.texts[0]);
    for (let i = 0; i < this.total; i++) {
      const t = this.targets[i % this.targets.length];
      this.pos[i * 3]     = t.x + (Math.random() - .5) * 30;
      this.pos[i * 3 + 1] = t.y + (Math.random() - .5) * 30;
      this.pos[i * 3 + 2] = 0;
    }
    this.geo.attributes['position'].needsUpdate = true;

    this._events();
    this.timer = setInterval(() => this._auto(), this.interval);
    this._loop();
  }

  /** Genera puntos en coordenadas centradas (0,0 = centro) usando el tamaño real */
  private _sample(text: string): { x: number; y: number }[] {
    const W = this.W, H = this.H;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d')!;

    // Font size: 58% del alto, reducir hasta que entre
    let fs = Math.floor(H * 0.62);
    ctx.font = `${fs}px 'Black Ops One', cursive`;
    while (ctx.measureText(text).width > W * 0.92 && fs > 6) {
      fs--;
      ctx.font = `${fs}px 'Black Ops One', cursive`;
    }

    // Dibujar texto centrado
    const tw    = ctx.measureText(text).width;
    const lineH = Math.max(2, fs * 0.055);
    const gap   = Math.max(2, fs * 0.12);
    const blockH = fs + gap + lineH;
    const startY = (H - blockH) / 2;

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, (W - tw) / 2, startY);
    ctx.fillRect((W - tw) / 2, startY + fs + gap, tw, lineH);

    // Muestrear píxeles con densidad adaptativa
    const step = Math.max(2, Math.round(Math.sqrt((W * H) / this.total)));
    const data = ctx.getImageData(0, 0, W, H).data;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < H; y += step)
      for (let x = 0; x < W; x += step)
        if (data[(y * W + x) * 4 + 3] > 100)
          pts.push({ x: x - W / 2, y: H / 2 - y });

    return pts.length ? pts : [{ x: 0, y: 0 }];
  }

  private _dot(shadow: boolean): any {
    const sz = 64, c = document.createElement('canvas');
    c.width = c.height = sz;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
    if (shadow) {
      g.addColorStop(0,   'rgba(0,255,180,.35)');
      g.addColorStop(.5,  'rgba(0,120,80,.08)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
    } else {
      g.addColorStop(0,   'rgba(255,255,255,1)');
      g.addColorStop(.3,  'rgba(0,255,195,.7)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sz, sz);
    const t = new THREE.Texture(c);
    t.needsUpdate = true;
    return t;
  }

  private _resize(): void {
    const rect = this.container.getBoundingClientRect();
    const W = Math.floor(rect.width);
    const H = Math.floor(rect.height);
    if (!W || !H || (W === this.W && H === this.H)) return;
    this.W = W; this.H = H;

    this.camera.left   = -W / 2; this.camera.right  = W / 2;
    this.camera.top    =  H / 2; this.camera.bottom = -H / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(W, H, false);
    const cv = this.renderer.domElement;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';

    this.targets = this._sample(this.texts[this.textIdx]);
  }

  private _auto(): void {
    this.disperse = true;
    this.pendingNext = true;
    setTimeout(() => {
      if (this.dead) return;
      this.disperse = false;
      if (this.pendingNext) {
        this.pendingNext = false;
        this.textIdx = (this.textIdx + 1) % this.texts.length;
        this.targets = this._sample(this.texts[this.textIdx]);
      }
    }, 1400);
  }

  private _events(): void {
    const el = this.container;
    this._down = (e) => { if (e.button === 0) { this.disperse = true;  this.pendingNext = true; } };
    this._up   = (e) => {
      if (e.button !== 0) return;
      this.disperse = false;
      if (this.pendingNext) {
        this.pendingNext = false;
        this.textIdx = (this.textIdx + 1) % this.texts.length;
        this.targets = this._sample(this.texts[this.textIdx]);
      }
    };
    this._move = (e) => {
      const r = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width  - .5) * 2;
      this.mouse.y = ((e.clientY - r.top)  / r.height - .5) * 2;
    };
    this._ctx = (e) => e.preventDefault();

    el.addEventListener('mousedown',   this._down);
    el.addEventListener('mouseup',     this._up);
    el.addEventListener('mousemove',   this._move);
    el.addEventListener('contextmenu', this._ctx);

    this.ro = new ResizeObserver(() => this._resize());
    this.ro.observe(el);
  }

  private _loop(): void {
    if (this.dead) return;
    this.raf = requestAnimationFrame(() => this._loop());

    const dr = Math.min(this.W, this.H) * 4;

    for (let i = 0; i < this.total; i++) {
      let tx: number, ty: number;
      if (this.disperse) {
        tx = (Math.random() - .5) * dr;
        ty = (Math.random() - .5) * dr;
      } else {
        const t = this.targets[i % this.targets.length];
        tx = t.x; ty = t.y;
      }
      this.pos[i*3]     += (tx - this.pos[i*3])     * .05;
      this.pos[i*3 + 1] += (ty - this.pos[i*3 + 1]) * .05;
      this.pos[i*3 + 2] += (0  - this.pos[i*3 + 2]) * .05;
    }
    this.geo.attributes['position'].needsUpdate = true;

    // Actualizar sombra
    if (this._spos) {
      for (let i = 0; i < this.total; i++) {
        this._spos[i*3]     = this.pos[i*3]     + 4;
        this._spos[i*3 + 1] = this.pos[i*3 + 1] - 4;
        this._spos[i*3 + 2] = this.pos[i*3 + 2] - 1;
      }
      this._sgeo.attributes['position'].needsUpdate = true;
    }

    this.scene.rotation.y += (this.mouse.x * .25 - this.scene.rotation.y) * .05;
    this.scene.rotation.x += (-this.mouse.y * .15 - this.scene.rotation.x) * .05;

    this.renderer.render(this.scene, this.camera);
  }

  destroy(): void {
    this.dead = true;
    cancelAnimationFrame(this.raf);
    clearInterval(this.timer);
    this.ro?.disconnect();
    this.container.removeEventListener('mousedown',   this._down);
    this.container.removeEventListener('mouseup',     this._up);
    this.container.removeEventListener('mousemove',   this._move);
    this.container.removeEventListener('contextmenu', this._ctx);
    this.renderer?.dispose();
    this.renderer?.domElement?.remove();
  }

  setColor(hex: number): void {
    if (this.mat) this.mat.color.set(hex);
  }
}