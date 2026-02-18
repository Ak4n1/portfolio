import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import {
  TrafficOverview,
  TrafficTimeSeriesPoint,
  TrafficPeriod,
  DimensionCount
} from './models/analytics-traffic.interface';
import { environment } from '../../../../environments/environment';

const API_BASE = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class AnalyticsTrafficService {
  private readonly http = inject(HttpClient);

  /** Obtiene el resumen de tráfico (1-6). */
  getTrafficOverview(period: TrafficPeriod = '7d'): Observable<TrafficOverview> {
    return this.http
      .get<TrafficOverview>(`${API_BASE}/api/analytics/traffic/overview`, {
        params: { period },
        withCredentials: true
      })
      .pipe(
        catchError(() => of(this.getFallbackOverview()))
      );
  }

  /** Obtiene serie temporal para gráfico de visitantes/sesiones. */
  getTrafficTimeSeries(period: TrafficPeriod = '7d'): Observable<TrafficTimeSeriesPoint[]> {
    return this.http
      .get<TrafficTimeSeriesPoint[]>(`${API_BASE}/api/analytics/traffic/series`, {
        params: { period },
        withCredentials: true
      })
      .pipe(
        catchError(() => of(this.getFallbackSeries()))
      );
  }

  private getFallbackOverview(): TrafficOverview {
    return {
      uniqueVisitors: 0,
      totalSessions: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDurationSeconds: 0,
      topPages: []
    };
  }

  private getFallbackSeries(): TrafficTimeSeriesPoint[] {
    return [];
  }

  getSessionsByHour(period: TrafficPeriod = '7d'): Observable<DimensionCount[]> {
    return this.http
      .get<DimensionCount[]>(`${API_BASE}/api/analytics/traffic/by-hour`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }

  getTrafficBySource(period: TrafficPeriod = '7d'): Observable<DimensionCount[]> {
    return this.http
      .get<DimensionCount[]>(`${API_BASE}/api/analytics/traffic/by-source`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }

  getTrafficByCountry(period: TrafficPeriod = '7d'): Observable<DimensionCount[]> {
    return this.http
      .get<DimensionCount[]>(`${API_BASE}/api/analytics/traffic/by-country`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }

  getTrafficByDevice(period: TrafficPeriod = '7d'): Observable<DimensionCount[]> {
    return this.http
      .get<DimensionCount[]>(`${API_BASE}/api/analytics/traffic/by-device`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }

  getTrafficByBrowser(period: TrafficPeriod = '7d'): Observable<DimensionCount[]> {
    return this.http
      .get<DimensionCount[]>(`${API_BASE}/api/analytics/traffic/by-browser`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }

  getTrafficByOs(period: TrafficPeriod = '7d'): Observable<DimensionCount[]> {
    return this.http
      .get<DimensionCount[]>(`${API_BASE}/api/analytics/traffic/by-os`, {
        params: { period },
        withCredentials: true
      })
      .pipe(catchError(() => of([])));
  }
}
