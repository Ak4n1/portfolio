import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, HostListener, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { 
  DEFAULT_TEXT_ANIMATION, 
  calculateTextPositions, 
  EASING_FUNCTIONS,
  TextAnimationConfig
} from './hero-canvas-v2-animations';

interface GridSquare {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  baseColor: string;
  currentOpacity: number;
  targetOpacity: number;
  isHovered: boolean;
  isTextSquare: boolean;      // Si este cuadrado es parte del texto
  textChar?: string;           // Carácter que representa este cuadrado
  textAnimationProgress: number; // Progreso de la animación de texto (0-1)
  twinkleProgress: number;    // 0 = apagado, 0.01-1 = parpadeando (estrellas)
}

@Component({
  selector: 'app-hero-canvas-v2',
  standalone: true,
  template: `
    <canvas 
      #heroCanvasV2
      class="hero-canvas-v2"
      (mousemove)="onMouseMove($event)"
      (mouseleave)="onMouseLeave()">
    </canvas>
  `,
  styles: [`
    .hero-canvas-v2 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: default;
      transition: cursor 0.2s ease;
      pointer-events: auto;
    }
    
    .hero-canvas-v2:hover {
      cursor: default;
    }
  `]
})
export class HeroCanvasV2Component implements AfterViewInit, OnDestroy {
  @ViewChild('heroCanvasV2', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private themeService = inject(ThemeService);
  constructor(private cdr: ChangeDetectorRef) { }

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  canvasWidth = 1200;
  canvasHeight = 800;

  // Configuración de la cuadrícula (similar al preloader)
  private squareSize = 100; // Tamaño base del cuadrado
  private mobileSquare = 8;    // Mucho más pequeño para móvil - ~400% más cuadrículas
  private tabletSquare = 15;   // Ajustado para tablet
  private desktopSquare = 30;  // Desktop
  private minCols = 40;  // Muchas más columnas mínimas para móvil
  private minRows = 25;  // Muchas más filas mínimas para móvil
  private gridCols = 0;
  private gridRows = 0;
  private gridSquares: GridSquare[] = [];

  // Colores según tema (modo oscuro/claro). El texto siempre igual (aqua) en ambos modos.
  private getThemeColors(): { gradientStart: string; gradientEnd: string; hoverAndBorder: string; textColor: string } {
    const isDark = this.themeService.getCurrentTheme() === 'dark';
    const textColor = '#00ffc3'; // Mismo texto y borde de texto en modo claro y oscuro
    if (isDark) {
      return { gradientStart: '#1A1A1A', gradientEnd: '#0F0F0F', hoverAndBorder: '#00ffc3', textColor };
    }
    return { gradientStart: '#f0f0f0', gradientEnd: '#e0e0e0', hoverAndBorder: '#1a1a1a', textColor };
  }

  // Estado del mouse
  private mouseX = 0;
  private mouseY = 0;
  private hoveredSquare: GridSquare | null = null;
  private animationTime = 0;

  // Animación de texto
  private textAnimationConfig: TextAnimationConfig = { ...DEFAULT_TEXT_ANIMATION };
  private textAnimationStartTime = 0;
  private textSquares: Map<string, GridSquare> = new Map(); // Mapa de "row-col" -> square
  private isTextAnimationActive = false;
  private textOffsetX = 0; // Offset horizontal para el movimiento
  private textBasePositions: Array<{ row: number; col: number; char: string }> = []; // Posiciones base del texto
  private textSpeed = 15;//Velocidad de desplazamiento (cuadrados por segundo) - aún más rápido
  private lastFrameTime = 0; // Para cálculo de delta time más preciso
  
  // Dirección del movimiento del texto
  public textDirection: 'left' | 'right' = 'right'; // Cambiar entre 'left' o 'right' para invertir el sentido

  // Fases: scrolling → aparecer uno a uno → desaparecer uno a uno → slide-down → (bucle)
  private textPhase: 'scrolling' | 'reveal' | 'hide' | 'slide-down' = 'scrolling';
  private revealStartTime = 0;
  private revealDelays: Map<string, number> = new Map(); // key "row-col" -> delay ms
  private revealStaggerMs = 100;
  private revealDurationMs = 200;
  private hideStartTime = 0;
  private hideDelays: Map<string, number> = new Map();
  private hideStaggerMs = 100;
  private hideDurationMs = 200;
  private textOffsetY = 0; // Offset vertical para movimiento desde arriba

  // Estrellas: parpadeo aleatorio de cuadrados (no los del texto)
  private twinkleSpeed = 0.006;   // Velocidad del parpadeo (más lento para que dure más)
  private twinkleSpawnChance = 0.08; // Probabilidad por frame de que aparezca una nueva estrella (más estrellas simultáneas)


  private themeSubscription?: Subscription;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCanvas();
      this.calculateGrid();
      this.initTextAnimation();
      this.lastFrameTime = Date.now();
      this.startAnimation();
      this.themeSubscription = this.themeService.currentTheme$.subscribe(() => {
        // Limpiar animaciones actuales
        this.clearTextSquares();
        this.isTextAnimationActive = false;
        
        // Recalcular la cuadrícula con los nuevos colores
        this.calculateGrid();
        
        // Reiniciar las animaciones desde el principio
        this.initTextAnimation();
      });
    }, 0);
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.themeSubscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.calculateGrid();
    // Reiniciar animación manteniendo el offset actual
    if (this.isTextAnimationActive) {
      this.updateTextPositions();
    } else {
      this.initTextAnimation();
    }
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Ajustar el tamaño del canvas al contenedor
    this.resizeCanvas();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.calculateGrid();
    });
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    const newWidth = rect.width || 1200;
    const newHeight = rect.height || 800;

    // Solo actualizar si las dimensiones han cambiado
    if (this.canvasWidth !== newWidth || this.canvasHeight !== newHeight) {
      this.canvasWidth = newWidth;
      this.canvasHeight = newHeight;

      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;

      // Forzar detección de cambios de manera segura
      this.cdr.detectChanges();
    }
  }

  private calculateGrid() {
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    
    // Determinar tamaño del cuadrado según el ancho
    if (width < 768) {
      this.squareSize = this.mobileSquare;
    } else if (width < 1024) {
      this.squareSize = this.tabletSquare;
    } else {
      this.squareSize = this.desktopSquare;
    }

    this.gridCols = Math.floor(width / this.squareSize);
    this.gridRows = Math.floor(height / this.squareSize);

    this.gridCols = Math.max(this.gridCols, this.minCols);
    this.gridRows = Math.max(this.gridRows, this.minRows);

    // Crear cuadrados de la cuadrícula
    this.gridSquares = [];
    const maxRow = Math.max(1, this.gridRows - 1);
    const maxCol = Math.max(1, this.gridCols - 1);
    const theme = this.getThemeColors();

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const x = col * this.squareSize;
        const y = row * this.squareSize;
        const width = this.squareSize;
        const height = this.squareSize;

        // Calcular color basado en posición y tema (modo claro = cuadrados blancos, oscuro = negros)
        const t = ((row / maxRow) + (col / maxCol)) / 2;
        const baseColor = this.mixHexColors(theme.gradientStart, theme.gradientEnd, t);

        this.gridSquares.push({
          row,
          col,
          x,
          y,
          width,
          height,
          baseColor,
          currentOpacity: 1,
          targetOpacity: 1,
          isHovered: false,
          isTextSquare: false,
          textAnimationProgress: 0,
          twinkleProgress: 0
        });
      }
    }
  }

  private initTextAnimation() {
    // Calcular posiciones base del texto (centrado)
    this.textBasePositions = calculateTextPositions(
      this.textAnimationConfig.text,
      this.gridCols,
      this.gridRows,
      this.squareSize,
      this.textAnimationConfig.direction
    );

    // Inicializar offsets
    this.textOffsetY = 0;
    
    // Calcular ancho total del texto para saber dónde empezar
    const textWidth = this.textBasePositions.length > 0 
      ? Math.max(...this.textBasePositions.map(p => p.col)) - Math.min(...this.textBasePositions.map(p => p.col)) + 1
      : 0;
    
    // Empezar según la dirección configurada
    if (this.textDirection === 'right') {
      // Movimiento de izquierda a derecha: empezar fuera por la izquierda
      this.textOffsetX = -textWidth - 5;
    } else {
      // Movimiento de derecha a izquierda: empezar fuera por la derecha
      this.textOffsetX = this.gridCols + 5;
    }

    // Iniciar animación después del delay
    setTimeout(() => {
      this.startTextAnimation();
    }, this.textAnimationConfig.delay);
  }

  private clearTextSquares() {
    this.textSquares.forEach(square => {
      square.isTextSquare = false;
      square.textChar = undefined;
      square.targetOpacity = 1;
      square.currentOpacity = 1;
    });
    this.textSquares.clear();
  }

  private updateTextPositions() {
    // Limpiar cuadrados de texto anteriores
    this.clearTextSquares();

    // Calcular nuevas posiciones con los offsets horizontal y vertical
    this.textBasePositions.forEach(pos => {
      const newCol = Math.floor(pos.col + this.textOffsetX);
      const newRow = Math.floor(pos.row + this.textOffsetY);
      
      // Solo mostrar si está dentro del canvas
      if (newCol >= 0 && newCol < this.gridCols && newRow >= 0 && newRow < this.gridRows) {
        const square = this.gridSquares[newRow * this.gridCols + newCol];
        if (square) {
          square.isTextSquare = true;
          square.textChar = pos.char;
          square.textAnimationProgress = 1;
          square.targetOpacity = 1;
          square.currentOpacity = 1;
          this.textSquares.set(`${newRow}-${newCol}`, square);
        }
      }
    });
  }

  private startTextAnimation() {
    this.isTextAnimationActive = true;
    this.textPhase = 'scrolling';
    this.textAnimationStartTime = Date.now();
    this.updateTextPositions();
  }

  private startRevealPhase() {
    this.textPhase = 'reveal';
    this.textOffsetX = 0;
    this.textOffsetY = 0; // Asegurar que esté centrado verticalmente
    this.updateTextPositions();
    this.revealDelays.clear();
    const ordered = Array.from(this.textSquares.entries()).sort((a, b) => {
      const [r1, c1] = [a[1].row, a[1].col];
      const [r2, c2] = [b[1].row, b[1].col];
      return c1 !== c2 ? c1 - c2 : r1 - r2;
    });
    ordered.forEach(([key], index) => {
      this.revealDelays.set(key, index * this.revealStaggerMs);
    });
    this.textSquares.forEach(square => {
      square.targetOpacity = 0;
      square.currentOpacity = 0;
      square.textAnimationProgress = 0;
    });
    this.revealStartTime = Date.now();
  }

  private startHidePhase() {
    this.textPhase = 'hide';
    this.hideDelays.clear();
    const ordered = Array.from(this.textSquares.entries()).sort((a, b) => {
      const [r1, c1] = [a[1].row, a[1].col];
      const [r2, c2] = [b[1].row, b[1].col];
      return c1 !== c2 ? c2 - c1 : r2 - r1; // Orden inverso: último en aparecer = primero en desaparecer
    });
    ordered.forEach(([key], index) => {
      this.hideDelays.set(key, index * this.hideStaggerMs);
    });
    this.textSquares.forEach(square => {
      square.targetOpacity = 1;
      square.currentOpacity = 1;
      square.textAnimationProgress = 1;
    });
    this.hideStartTime = Date.now();
  }

  private startSlideDownPhase() {
    this.textPhase = 'slide-down';
    
    // Calcular posición inicial (arriba, fuera del canvas)
    // Las posiciones base están centradas verticalmente, así que empezamos desde arriba
    const centerRow = Math.floor(this.gridRows / 2);
    const letterHeight = 8;
    const startRow = centerRow - Math.floor(letterHeight / 2); // Fila inicial de las posiciones base
    this.textOffsetY = -startRow - 5; // Empezar arriba, fuera del canvas
    
    // Mantener texto centrado horizontalmente durante el slide-down
    this.textOffsetX = 0;
    
    // Actualizar posiciones para mostrar el texto desde arriba
    this.updateTextPositions();
    
    // Hacer todos los cuadrados visibles inmediatamente (ya aparecieron antes)
    this.textSquares.forEach(square => {
      square.targetOpacity = 1;
      square.currentOpacity = 1;
      square.textAnimationProgress = 1;
    });
  }

  private mixHexColors(hex1: string, hex2: string, t: number): string {
    const c1 = this.hexToRgb(hex1);
    const c2 = this.hexToRgb(hex2);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  private getAdjacentSquares(square: GridSquare): GridSquare[] {
    const adjacent: GridSquare[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = square.row + dRow;
      const newCol = square.col + dCol;
      if (newRow >= 0 && newRow < this.gridRows && newCol >= 0 && newCol < this.gridCols) {
        const adjacentSquare = this.gridSquares[newRow * this.gridCols + newCol];
        if (adjacentSquare) {
          adjacent.push(adjacentSquare);
        }
      }
    }

    return adjacent;
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;

    // Encontrar el cuadrado bajo el mouse
    const hoveredSquare = this.gridSquares.find(square =>
      this.mouseX >= square.x &&
      this.mouseX <= square.x + square.width &&
      this.mouseY >= square.y &&
      this.mouseY <= square.y + square.height
    );

    // Resetear estado anterior
    if (this.hoveredSquare && this.hoveredSquare !== hoveredSquare) {
      this.hoveredSquare.isHovered = false;
      this.hoveredSquare.targetOpacity = 1;
      const previousAdjacent = this.getAdjacentSquares(this.hoveredSquare);
      previousAdjacent.forEach(adj => {
        adj.isHovered = false;
        adj.targetOpacity = 1;
      });
    }

    // Aplicar hover al nuevo cuadrado
    if (hoveredSquare) {
      this.hoveredSquare = hoveredSquare;
      hoveredSquare.isHovered = true;
      hoveredSquare.targetOpacity = 0.3;

      const adjacent = this.getAdjacentSquares(hoveredSquare);
      adjacent.forEach(adj => {
        adj.isHovered = true;
        adj.targetOpacity = 0.5;
      });
    }
  }

  onMouseLeave() {
    // Resetear todos los cuadrados
    if (this.hoveredSquare) {
      this.hoveredSquare.isHovered = false;
      this.hoveredSquare.targetOpacity = 1;
      const adjacent = this.getAdjacentSquares(this.hoveredSquare);
      adjacent.forEach(adj => {
        adj.isHovered = false;
        adj.targetOpacity = 1;
      });
      this.hoveredSquare = null;
    }
  }


  private startAnimation() {
    this.animate();
  }

  private animate() {
    const currentTime = Date.now();
    const deltaTime = this.lastFrameTime > 0 ? (currentTime - this.lastFrameTime) / 1000 : 0.016; // Delta en segundos
    this.lastFrameTime = currentTime;
    
    this.animationTime += deltaTime;
    
    // Actualizar movimiento del texto con delta time para mayor fluidez
    if (this.isTextAnimationActive) {
      // Calcular ancho total del texto
      const textWidth = this.textBasePositions.length > 0 
        ? Math.max(...this.textBasePositions.map(p => p.col)) - Math.min(...this.textBasePositions.map(p => p.col)) + 1
        : 0;
      
      let endOffset: number;
      
      if (this.textDirection === 'right') {
        // Movimiento de izquierda a derecha
        endOffset = this.gridCols + 5;
        
        // Mover hacia la derecha
        this.textOffsetX += this.textSpeed * deltaTime;
        
        // Cuando sale por la derecha, pasar a fase aparecer
        if (this.textOffsetX >= endOffset) {
          this.isTextAnimationActive = false;
          this.startRevealPhase();
        } else {
          this.updateTextPositions();
        }
      } else {
        // Movimiento de derecha a izquierda
        endOffset = -textWidth - 5;
        
        // Mover hacia la izquierda
        this.textOffsetX -= this.textSpeed * deltaTime;
        
        // Cuando sale por la izquierda, pasar a fase aparecer
        if (this.textOffsetX <= endOffset) {
          this.isTextAnimationActive = false;
          this.startRevealPhase();
        } else {
          this.updateTextPositions();
        }
      }
    } else if (this.textPhase === 'reveal') {
      const elapsed = currentTime - this.revealStartTime;
      let allVisible = true;
      this.textSquares.forEach(square => {
        const key = `${square.row}-${square.col}`;
        const delay = this.revealDelays.get(key) ?? 0;
        const progress = Math.max(0, Math.min(1, (elapsed - delay) / this.revealDurationMs));
        const eased = 1 - Math.pow(1 - progress, 2);
        square.targetOpacity = eased;
        square.textAnimationProgress = eased;
        if (eased < 1) allVisible = false;
      });
      if (allVisible && this.textSquares.size > 0) {
        const maxDelay = Math.max(...this.revealDelays.values());
        if (elapsed >= maxDelay + this.revealDurationMs) {
          this.startHidePhase();
        }
      }
    } else if (this.textPhase === 'hide') {
      const elapsed = currentTime - this.hideStartTime;
      let allHidden = true;
      this.textSquares.forEach(square => {
        const key = `${square.row}-${square.col}`;
        const delay = this.hideDelays.get(key) ?? 0;
        const progress = Math.max(0, Math.min(1, (elapsed - delay) / this.hideDurationMs));
        const eased = 1 - Math.pow(1 - progress, 2);
        square.targetOpacity = 1 - eased;
        square.textAnimationProgress = 1 - eased;
        if (square.targetOpacity > 0.01) allHidden = false;
      });
      const maxDelay = this.hideDelays.size > 0 ? Math.max(...this.hideDelays.values()) : 0;
      if (elapsed >= maxDelay + this.hideDurationMs) {
        this.startSlideDownPhase();
      }
    } else if (this.textPhase === 'slide-down') {
      // Mover texto desde arriba hacia abajo hasta la posición inicial del scrolling
      const textHeight = this.textBasePositions.length > 0
        ? Math.max(...this.textBasePositions.map(p => p.row)) - Math.min(...this.textBasePositions.map(p => p.row)) + 1
        : 0;
      
      // Posición inicial del scrolling (fuera por la izquierda)
      const textWidth = this.textBasePositions.length > 0 
        ? Math.max(...this.textBasePositions.map(p => p.col)) - Math.min(...this.textBasePositions.map(p => p.col)) + 1
        : 0;
      const scrollingStartOffsetX = this.textDirection === 'right' ? -textWidth - 5 : this.gridCols + 5;
      
      // Posición vertical objetivo (centro vertical donde empieza el scrolling)
      // Las posiciones base ya están centradas, así que targetOffsetY = 0
      const targetOffsetY = 0;
      
      // Mover hacia abajo
      this.textOffsetY += this.textSpeed * deltaTime;
      
      // Cuando llegue a la posición objetivo, reiniciar scrolling
      if (this.textOffsetY >= targetOffsetY) {
        this.textOffsetY = 0; // Resetear offset vertical (las posiciones base ya están centradas)
        this.textOffsetX = scrollingStartOffsetX;
        this.textPhase = 'scrolling';
        this.isTextAnimationActive = true;
        this.textAnimationStartTime = Date.now();
        this.updateTextPositions();
      } else {
        this.updateTextPositions();
      }
    }
    
    this.updateTwinkles(deltaTime);
    this.clearCanvas();
    this.drawGrid();
    this.animationId = requestAnimationFrame(() => this.animate());
  }


  private updateTwinkles(deltaTime: number) {
    const frameRate = 60;
    const step = this.twinkleSpeed * (deltaTime * frameRate);
    
    this.gridSquares.forEach(square => {
      if (square.twinkleProgress > 0) {
        square.twinkleProgress += step;
        if (square.twinkleProgress >= 1) {
          square.twinkleProgress = 0;
        }
      }
    });
    
    if (Math.random() < this.twinkleSpawnChance) {
      const nonTextSquares = this.gridSquares.filter(s => !s.isTextSquare && s.twinkleProgress === 0);
      if (nonTextSquares.length > 0) {
        const star = nonTextSquares[Math.floor(Math.random() * nonTextSquares.length)];
        star.twinkleProgress = 0.01;
      }
    }
  }

  private getTwinkleIntensity(progress: number): number {
    if (progress <= 0) return 0;
    // Subida rápida: 0 a 0.1 (10% del tiempo)
    if (progress <= 0.1) return progress / 0.1;
    // Hold en verde: 0.1 a 0.6 (50% del tiempo ≈ 1 segundo si total es ~2s)
    if (progress <= 0.6) return 1;
    // Bajada lenta: 0.6 a 1.0 (40% del tiempo)
    return 1 - (progress - 0.6) / 0.4;
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawGrid() {
    const theme = this.getThemeColors();
    const hoverAndBorder = theme.hoverAndBorder;
    const textColor = theme.textColor; // Siempre aqua en claro y oscuro

    // Dibujar cada cuadrado de la cuadrícula
    this.gridSquares.forEach(square => {
      // Interpolación suave de opacidad
      const lerpSpeed = 0.15;
      square.currentOpacity += (square.targetOpacity - square.currentOpacity) * lerpSpeed;

      this.ctx.save();

      // Texto siempre mismo color (aqua) en modo claro y oscuro
      if (square.isTextSquare && square.currentOpacity > 0.1) {
        this.ctx.fillStyle = textColor;
        this.ctx.globalAlpha = square.currentOpacity * square.textAnimationProgress;
        this.ctx.shadowColor = textColor;
        this.ctx.shadowBlur = 20;
      } else if (square.isHovered) {
        this.ctx.fillStyle = hoverAndBorder;
        this.ctx.globalAlpha = square.currentOpacity;
        this.ctx.shadowColor = hoverAndBorder;
        this.ctx.shadowBlur = 15;
      } else if (square.twinkleProgress > 0) {
        const intensity = this.getTwinkleIntensity(square.twinkleProgress);
        const starColor = theme.textColor;
        this.ctx.fillStyle = square.baseColor;
        this.ctx.globalAlpha = square.currentOpacity;
        this.ctx.shadowBlur = 0;
      } else {
        this.ctx.fillStyle = square.baseColor;
        this.ctx.globalAlpha = square.currentOpacity;
        this.ctx.shadowBlur = 0;
      }

      const padding = 1;
      this.ctx.fillRect(
        square.x + padding,
        square.y + padding,
        square.width - padding * 2,
        square.height - padding * 2
      );

      // Capa extra de parpadeo (estrellas): verde aqua semitransparente
      if (square.twinkleProgress > 0 && !square.isTextSquare) {
        const intensity = this.getTwinkleIntensity(square.twinkleProgress);
        this.ctx.fillStyle = theme.textColor;
        this.ctx.globalAlpha = square.currentOpacity * intensity;
        this.ctx.shadowColor = theme.textColor;
        this.ctx.shadowBlur = intensity * 12;
        this.ctx.fillRect(
          square.x + padding,
          square.y + padding,
          square.width - padding * 2,
          square.height - padding * 2
        );
      }

      // Borde: texto siempre aqua; hover según tema
      if (square.isTextSquare && square.currentOpacity > 0.1) {
        this.ctx.strokeStyle = textColor;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = square.currentOpacity * 0.5;
        this.ctx.strokeRect(
          square.x + padding,
          square.y + padding,
          square.width - padding * 2,
          square.height - padding * 2
        );
      } else if (square.isHovered) {
        this.ctx.strokeStyle = hoverAndBorder;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = square.currentOpacity * 0.5;
        this.ctx.strokeRect(
          square.x + padding,
          square.y + padding,
          square.width - padding * 2,
          square.height - padding * 2
        );
      }

      this.ctx.restore();
    });
  }

}
