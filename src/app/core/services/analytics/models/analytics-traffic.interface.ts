/**
 * Modelos para analíticas de tráfico (Tráfico general 1-6).
 * Compatible con GA4 y respuestas del backend.
 */
export interface TrafficOverview {
  uniqueVisitors: number;
  totalSessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDurationSeconds: number;
  topPages: PageViewItem[];
}

export interface PageViewItem {
  path: string;
  title: string;
  views: number;
}

export interface TrafficTimeSeriesPoint {
  date: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export type TrafficPeriod = '7d' | '14d' | '30d';

/** DTO genérico para gráficos de barras (origen, país, dispositivo, etc.). */
export interface DimensionCount {
  label: string;
  value: number;
}
