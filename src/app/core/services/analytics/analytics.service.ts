import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Servicio central de analytics.
 * Wrapper de gtag para eventos personalizados y helpers.
 * GA4 se inicializa en index.html; aquí solo exponemos métodos para trackear.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly measurementId = 'G-HW44VYL0PR';

  /** Indica si gtag está disponible (solo en browser). */
  get isAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && typeof window.gtag === 'function';
  }

  /** Envía un evento personalizado a GA4. */
  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!this.isAvailable) return;
    window.gtag!('event', eventName, {
      send_to: this.measurementId,
      ...params
    });
  }

  /** Vista de página personalizada (útil para SPAs si no se usa router automático). */
  trackPageView(path: string, title?: string): void {
    if (!this.isAvailable) return;
    window.gtag!('config', this.measurementId, {
      page_path: path,
      page_title: title ?? document.title
    });
  }

  /** Enlace a Google Analytics (para abrir desde el dashboard). */
  getGoogleAnalyticsUrl(): string {
    return 'https://analytics.google.com/';
  }
}
