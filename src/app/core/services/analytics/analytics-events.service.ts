import { Injectable, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

/**
 * Eventos de clicks y acciones (métricas 10-15).
 * Cada método envía un evento a GA4 con parámetros consistentes.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsEventsService {
  private readonly analytics = inject(AnalyticsService);

  /** 10 - Click en email o LinkedIn (contacto) */
  trackClickContactEmail(source: 'footer' | 'contact_copy' | 'contact_page'): void {
    this.analytics.trackEvent('click_contact_email', { source });
  }

  trackClickContactLinkedIn(source: 'footer' | 'contact_social'): void {
    this.analytics.trackEvent('click_contact_linkedin', { source });
  }

  /** 11 - Click en CTA principal "Ver proyectos" o "Contactar" */
  trackClickCtaProjects(source: 'hero_home' | 'projects_cta'): void {
    this.analytics.trackEvent('click_cta_projects', { source });
  }

  trackClickCtaContact(source: string): void {
    this.analytics.trackEvent('click_cta_contact', { source });
  }

  /** 12 - Click en proyecto (card del listado) */
  trackClickProjectCard(projectId: number, projectTitle: string): void {
    this.analytics.trackEvent('click_project_card', {
      project_id: projectId,
      project_title: projectTitle
    });
  }

  /** 13 - Click en redes sociales */
  trackClickSocial(network: string, source: string, projectId?: number): void {
    this.analytics.trackEvent('click_social', {
      network,
      source,
      ...(projectId != null && { project_id: projectId })
    });
  }

  /** 14 - Click en descargar CV */
  trackClickDownloadCv(): void {
    this.analytics.trackEvent('click_download_cv', {});
  }

  /** 15 - Abandono de formulario de contacto */
  trackContactFormAbandoned(fieldsTouched: string[]): void {
    this.analytics.trackEvent('contact_form_abandoned', {
      fields_touched: fieldsTouched.join(','),
      fields_count: fieldsTouched.length
    });
  }
}
