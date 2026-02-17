import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

interface GridItem {
  id: number;
  row: number;
  col: number;
  index: number;
}

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.css'
})
export class PreloaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('preloader') preloader!: ElementRef;
  @ViewChild('centerInfo') centerInfo!: ElementRef;

  @Output() preloaderComplete = new EventEmitter<void>();

  // =====================
  // Configuración OPTIMIZADA (misma apariencia, menos memoria)
  // =====================
  public isDevelopment = false; // 🚀 Desactivar logs
  public showSquareIds = false;
  public gradientStartColor = '#1A1A1A';
  public gradientEndColor = '#0F0F0F';
  // 🚀 OPTIMIZACIÓN: Menos elementos DOM (misma apariencia visual)
  public mobileSquare = 60;   // Era 40 -> menos elementos
  public tabletSquare = 80;   // Era 60 -> menos elementos
  public desktopSquare = 100; // Era 80 -> menos elementos
  public minCols = 6;         // Era 8 -> menos elementos
  public minRows = 4;         // Era 6 -> menos elementos
  public revealEnabled = true;
  public revealDuration = 0.15;
  public revealEase = 'power2.out';
  public revealStagger = 0.01;
  public revealFrom: 'random' | 'start' | 'end' | number = 'random';
  public autoHideOnComplete = true;
  // Nuevo: retraso antes de iniciar el reveal (ms)
  public revealStartDelayMs = 1000;

  // =====================
  // Estado interno
  // =====================
  public gridItems: GridItem[] = [];
  public gridRows = 0;
  public gridCols = 0;
  public squareSize = 0;

  ngOnInit() {
    this.calculateGrid();
    this.disableScroll();
  }

  ngAfterViewInit() {
    // Aplicar colores inmediatamente tras el render
    setTimeout(() => this.applyGradientColors(), 50);

    // Animación de puntos mientras esperamos
    const dots = Array.from(document.querySelectorAll<HTMLElement>('.loading-dot'));
    if (dots.length) {
      gsap.set(dots, { opacity: 0.2, y: 0 });
      gsap.to(dots, {
        keyframes: [{ opacity: 1, y: -3 }, { opacity: 0.2, y: 0 }],
        repeat: -1,
        stagger: 0.15,
        ease: 'sine.inOut',
        duration: 0.8
      });
    }

    // Iniciar reveal tras el retraso configurado
    if (this.revealEnabled) {
      setTimeout(() => {
        // Detener animación de puntos y desvanecer overlay
        gsap.killTweensOf(dots);
        gsap.to(this.centerInfo?.nativeElement, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' });
        this.startRevealAnimation();
      }, this.revealStartDelayMs);
    }
  }

  ngOnDestroy() {
    this.enableScroll();
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateGrid();
    setTimeout(() => this.applyGradientColors(), 0);
  }

  private disableScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  private enableScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  private calculateGrid() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
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

    this.gridItems = [];
    let id = 0;
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        this.gridItems.push({ id: id++, row, col, index: id - 1 });
      }
    }

    this.generateAdjacencyMap();
  }

  public getAdjacentSquares(squareId: number): number[] {
    // 🚀 OPTIMIZACIÓN: Cálculo directo sin búsquedas
    const row = Math.floor(squareId / this.gridCols);
    const col = squareId % this.gridCols;
    
    const adjacent: number[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (newRow >= 0 && newRow < this.gridRows && newCol >= 0 && newCol < this.gridCols) {
        // 🚀 Cálculo directo del ID sin búsquedas
        const adjacentId = newRow * this.gridCols + newCol;
        adjacent.push(adjacentId);
      }
    }

    return adjacent;
  }

  private generateAdjacencyMap() {
    const adjacencyMap = new Map<number, number[]>();
    for (const square of this.gridItems) {
      adjacencyMap.set(square.id, this.getAdjacentSquares(square.id));
    }
    return adjacencyMap;
  }

  private applyGradientColors() {
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('.grid-item'));
    if (tiles.length === 0) return;

    const maxRow = Math.max(1, this.gridRows - 1);
    const maxCol = Math.max(1, this.gridCols - 1);
    
    // 🚀 OPTIMIZACIÓN: Cache de colores para evitar recálculos
    const colorCache = new Map<string, string>();

    tiles.forEach(tile => {
      const row = parseInt(tile.getAttribute('data-row') || '0', 10);
      const col = parseInt(tile.getAttribute('data-col') || '0', 10);
      
      const cacheKey = `${row}-${col}`;
      if (!colorCache.has(cacheKey)) {
        const t = ((row / maxRow) + (col / maxCol)) / 2;
        const color = this.mixHexColors(this.gradientStartColor, this.gradientEndColor, t);
        colorCache.set(cacheKey, color);
      }
      
      tile.style.backgroundColor = colorCache.get(cacheKey)!;
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

  public hide() {
    if (this.preloader) {
      this.preloader.nativeElement.style.display = 'none';
    }
    this.enableScroll();
    if (this.autoHideOnComplete) this.preloaderComplete.emit();
  }

  public show() {
    if (this.preloader) {
      this.preloader.nativeElement.style.display = 'flex';
    }
    this.disableScroll();
  }

  public startRevealAnimation() {
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('.grid-item'));
    if (tiles.length === 0) return;

    gsap.utils.shuffle(tiles);
    gsap.set(tiles, { opacity: 1 });

    gsap.to(tiles, {
      opacity: 0,
      duration: this.revealDuration,
      ease: this.revealEase as any,
      stagger: { each: this.revealStagger, from: this.revealFrom as any },
      onComplete: () => this.hide()
    });
  }

  public onSquareHover(squareId: number) {
    const primaryGlow = 'color-mix(in srgb, var(--primary-color) 30%, transparent)';
    const adjacentIds = this.getAdjacentSquares(squareId);
    const hoveredSquare = document.querySelector(`[data-id="${squareId}"]`) as HTMLElement;
    if (hoveredSquare) {
      hoveredSquare.style.backgroundColor = '#0F0F0F';
      hoveredSquare.style.borderColor = primaryGlow;
      hoveredSquare.style.boxShadow = `0 0 8px ${primaryGlow}`;
    }
    adjacentIds.forEach(id => {
      const adjacentSquare = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      if (adjacentSquare) {
        adjacentSquare.style.backgroundColor = '#0F0F0F';
        adjacentSquare.style.borderColor = primaryGlow;
        adjacentSquare.style.boxShadow = `0 0 8px ${primaryGlow}`;
      }
    });
  }

  public onSquareLeave(squareId: number) {
    const adjacentIds = this.getAdjacentSquares(squareId);
    const hoveredSquare = document.querySelector(`[data-id="${squareId}"]`) as HTMLElement;
    if (hoveredSquare) {
      hoveredSquare.style.backgroundColor = '';
      hoveredSquare.style.borderColor = '';
      hoveredSquare.style.boxShadow = 'none';
    }
    adjacentIds.forEach(id => {
      const adjacentSquare = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      if (adjacentSquare) {
        adjacentSquare.style.backgroundColor = '';
        adjacentSquare.style.borderColor = '';
        adjacentSquare.style.boxShadow = 'none';
      }
    });
    this.applyGradientColors();
  }

  public test() {
    const square147 = document.querySelector(`[data-id="147"]`) as HTMLElement;
    if (square147) {
      square147.style.backgroundColor = 'transparent';
      square147.style.borderColor = 'transparent';
      square147.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
    }
  }
}
