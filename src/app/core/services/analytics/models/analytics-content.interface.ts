/**
 * Modelos para analíticas de contenido y proyectos (7-9).
 */
export interface ProjectViewItem {
  projectId: number;
  title: string;
  views: number;
}

/** Conteo de eventos de clicks y acciones (10-15). */
export interface ClickEvents {
  clickContactEmail: number;
  clickContactLinkedin: number;
  clickCtaProjects: number;
  clickCtaContact: number;
  clickProjectCard: number;
  clickSocial: number;
  contactFormAbandoned: number;
  clickDownloadCv: number;
}

export type TrafficPeriod = '7d' | '14d' | '30d';
