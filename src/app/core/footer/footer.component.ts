import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsEventsService } from '../services/analytics/analytics-events.service';
import { ParticleBrandEngine } from './particle-brand.engine';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleBrand') particleBrandRef!: ElementRef<HTMLElement>;

  private readonly analyticsEvents = inject(AnalyticsEventsService);
  private particleEngine: ParticleBrandEngine | null = null;

  ngAfterViewInit(): void {
    const init = () => this._initParticles();
    if (document.fonts?.ready) {
      document.fonts.ready.then(init);
    } else {
      setTimeout(init, 300);
    }
  }

  ngOnDestroy(): void {
    this.particleEngine?.destroy();
  }

  private _initParticles(): void {
    const el = this.particleBrandRef?.nativeElement;
    if (!el) return;

    // Leer --primary-color del CSS para que coincida con el tema
    const primary = this._cssColorToHex('--primary-color') ?? 0x00ffc3;
    const shadow = this._cssColorToHex('--primary-color', 0.6) ?? primary;

    this.particleEngine = new ParticleBrandEngine(el, {
      texts: ['Ak4n1', 'Juan Encabo'],
      total: 4000,
      interval: 10000,
      color: 0x01E5AC,
      shadowColor: 0x01E5AC,
    });
  }

  /** Lee una CSS variable y la convierte a número hex para Three.js */
  private _cssColorToHex(varName: string, _opacity = 1): number | null {
    try {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(varName).trim();
      if (!raw) return null;
      // Soporta #rrggbb y #rgb
      const hex = raw.startsWith('#') ? raw : null;
      if (!hex) return null;
      const clean = hex.replace('#', '');
      const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
      return parseInt(full, 16);
    } catch {
      return null;
    }
  }

  onEmailClick(): void {
    this.analyticsEvents.trackClickContactEmail('footer');
  }

  onGitHubClick(): void {
    this.analyticsEvents.trackClickSocial('github', 'footer');
  }

  onLinkedInClick(): void {
    this.analyticsEvents.trackClickContactLinkedIn('footer');
  }
  enableNotifications(event: Event): void {
    event.preventDefault();

    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    if (Notification.permission === 'granted') {
      this._showNotification();
      return;
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this._showNotification();
        }
      });
    }
  }

  private _showNotification(): void {
    new Notification('Ak4n1 Portfolio 🚀', {
      body: 'Gracias por visitar mi portfolio. Pronto habrá nuevos proyectos 👀',
      icon: '/favicon.ico'
    });
  }

}