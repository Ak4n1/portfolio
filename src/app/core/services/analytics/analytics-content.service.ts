import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { ClickEvents, ProjectViewItem, TrafficPeriod } from './models/analytics-content.interface';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AnalyticsContentService {
  private readonly http = inject(HttpClient);

  /** Proyectos más visitados (métrica 7). */
  getTopProjects(period: TrafficPeriod = '7d'): Observable<ProjectViewItem[]> {
    return this.http
      .get<ProjectViewItem[]>(`${API_BASE}/api/analytics/projects/top`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }

  /** Eventos de clicks y acciones (métricas 10-15). */
  getClickEvents(period: TrafficPeriod = '7d'): Observable<ClickEvents> {
    return this.http
      .get<ClickEvents>(`${API_BASE}/api/analytics/events/clicks`, {
        params: { period },
        withCredentials: true
      })
      .pipe(
        catchError(() =>
          of({
            clickContactEmail: 0,
            clickContactLinkedin: 0,
            clickCtaProjects: 0,
            clickCtaContact: 0,
            clickProjectCard: 0,
            clickSocial: 0,
            contactFormAbandoned: 0,
            clickDownloadCv: 0
          })
        )
      );
  }

  /** Cuántas veces llegaron al final del detalle de un proyecto (métrica 9). */
  getScrollCompletions(period: TrafficPeriod = '7d'): Observable<number> {
    return this.http
      .get<number>(`${API_BASE}/api/analytics/projects/scroll-completions`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of(0)));
  }

  /** Vistas de un proyecto por ID (métrica 8). */
  getProjectViews(projectId: number, period: TrafficPeriod = '7d'): Observable<number> {
    return this.http
      .get<number>(`${API_BASE}/api/analytics/projects/${projectId}/views`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of(0)));
  }
}
