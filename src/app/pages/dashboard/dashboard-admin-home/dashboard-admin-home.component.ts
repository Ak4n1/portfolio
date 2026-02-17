import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsTrafficService } from '../../../core/services/analytics/analytics-traffic.service';
import { AnalyticsContentService } from '../../../core/services/analytics/analytics-content.service';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import {
  TrafficOverview,
  TrafficTimeSeriesPoint
} from '../../../core/services/analytics/models/analytics-traffic.interface';
import {
  ClickEvents,
  ProjectViewItem,
  TrafficPeriod
} from '../../../core/services/analytics/models/analytics-content.interface';

@Component({
  selector: 'app-dashboard-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard-admin-home.component.html',
  styleUrl: './dashboard-admin-home.component.css'
})
export class DashboardAdminHomeComponent implements OnInit {
  private readonly trafficService = inject(AnalyticsTrafficService);
  private readonly contentService = inject(AnalyticsContentService);
  private readonly analyticsService = inject(AnalyticsService);

  overview = signal<TrafficOverview | null>(null);
  trafficSeries = signal<TrafficTimeSeriesPoint[]>([]);
  topProjects = signal<ProjectViewItem[]>([]);
  scrollCompletions = signal<number>(0);
  clickEvents = signal<ClickEvents | null>(null);
  sessionsByHour = signal<{ label: string; value: number }[]>([]);
  trafficBySource = signal<{ label: string; value: number }[]>([]);
  trafficByCountry = signal<{ label: string; value: number }[]>([]);
  trafficByDevice = signal<{ label: string; value: number }[]>([]);
  trafficByBrowser = signal<{ label: string; value: number }[]>([]);
  trafficByOs = signal<{ label: string; value: number }[]>([]);
  period = signal<TrafficPeriod>('7d');
  loading = signal(true);

  ga4Url = this.analyticsService.getGoogleAnalyticsUrl();

  /** Datos para gráfico de línea (tráfico por día) */
  lineChartData = computed(() => {
    const series = this.trafficSeries();
    if (!series.length) return { labels: [] as string[], datasets: [] };
    const primary = 'rgb(2, 163, 126)';
    return {
      labels: series.map(p => this.formatDateShort(p.date)),
      datasets: [
        { data: series.map(p => p.pageViews), label: 'Páginas vistas', borderColor: primary, backgroundColor: 'rgba(2, 163, 126, 0.2)' },
        { data: series.map(p => p.sessions), label: 'Sesiones', borderColor: 'rgba(2, 163, 126, 0.5)', borderDash: [4], backgroundColor: 'transparent' }
      ]
    };
  });

  /** Segmentos deshabilitados (click para alternar) */
  disabledSegments = signal<Set<string>>(new Set());
  /** Segmento con hover (para tooltip) */
  hoveredSegment = signal<string | null>(null);

  /** Segmentos para donut SVG (datos GA4) */
  donutSegments = computed(() => {
    const ev = this.clickEvents();
    const disabled = this.disabledSegments();
    if (!ev) return [] as { label: string; value: number; percent: number; color: string; from: number; to: number; path: string }[];
    const items = [
      { label: 'CTA Proyectos', value: ev.clickCtaProjects },
      { label: 'CTA Contacto', value: ev.clickCtaContact },
      { label: 'Tarjeta proyecto', value: ev.clickProjectCard },
      { label: 'Redes sociales', value: ev.clickSocial },
      { label: 'Email/LinkedIn', value: ev.clickContactEmail + ev.clickContactLinkedin },
      { label: 'Abandono form.', value: ev.contactFormAbandoned },
      { label: 'Descargar CV', value: ev.clickDownloadCv }
    ];
    const total = items.reduce((s, i) => s + i.value, 0);
    if (total === 0) return [];
    const colors = ['rgb(2, 163, 126)', 'rgba(2, 163, 126, 0.85)', 'rgba(2, 163, 126, 0.7)', 'rgba(2, 163, 126, 0.55)', 'rgba(2, 163, 126, 0.4)', 'rgba(2, 163, 126, 0.3)', 'rgba(2, 163, 126, 0.2)'];
    let acc = 0;
    return items
      .filter(i => i.value > 0)
      .map((i, idx) => {
        const percent = (i.value / total) * 100;
        const from = acc;
        acc += percent;
        const path = this.arcPath(from, acc);
        return { ...i, percent, color: colors[idx % colors.length], from, to: acc, path };
      });
  });

  private arcPath(fromPct: number, toPct: number): string {
    const cx = 70; const cy = 70;
    const R = 65; const r = 28;
    const a1 = ((fromPct / 100) * 360 - 90) * Math.PI / 180;
    const a2 = ((toPct / 100) * 360 - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(a1); const y1 = cy + r * Math.sin(a1);
    const x2 = cx + R * Math.cos(a1); const y2 = cy + R * Math.sin(a1);
    const x3 = cx + R * Math.cos(a2); const y3 = cy + R * Math.sin(a2);
    const x4 = cx + r * Math.cos(a2); const y4 = cy + r * Math.sin(a2);
    const large = toPct - fromPct > 50 ? 1 : 0;
    return `M ${x1} ${y1} L ${x2} ${y2} A ${R} ${R} 0 ${large} 1 ${x3} ${y3} L ${x4} ${y4} A ${r} ${r} 0 ${large} 0 ${x1} ${y1} Z`;
  }

  toggleSegment(label: string): void {
    this.disabledSegments.update(s => {
      const next = new Set(s);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  /** Total de eventos de clicks */
  totalClicks = computed(() => {
    const ev = this.clickEvents();
    if (!ev) return 0;
    return ev.clickCtaProjects + ev.clickCtaContact + ev.clickProjectCard +
      ev.clickSocial + (ev.clickContactEmail + ev.clickContactLinkedin) + ev.contactFormAbandoned + ev.clickDownloadCv;
  });

  /** Páginas con % para la tabla */
  topPagesWithPercent = computed(() => {
    const o = this.overview();
    if (!o?.topPages?.length) return [];
    const total = o.topPages.reduce((s, p) => s + p.views, 0);
    return o.topPages.map(p => ({
      ...p,
      percent: total > 0 ? (p.views / total * 100) : 0
    }));
  });

  /** Proyectos con nivel de interés (1-5) para mini bars */
  projectsWithInterest = computed(() => {
    const list = this.topProjects();
    if (!list.length) return [];
    const max = Math.max(...list.map(p => p.views), 1);
    return list.map(p => ({ ...p, level: max > 0 ? Math.ceil((p.views / max) * 5) : 0 }));
  });

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#e2e8f0' } } },
    scales: {
      x: { ticks: { color: '#94a3b8', maxTicksLimit: 12 }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
    }
  };

  readonly barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } }
    }
  };

  readonly barChartOptionsVertical = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8', maxTicksLimit: 24 }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
    }
  };

  toBarChartData(items: { label: string; value: number }[]) {
    const primary = 'rgba(2, 163, 126, 0.8)';
    return {
      labels: items.map(i => i.label),
      datasets: [{ data: items.map(i => i.value), label: '', backgroundColor: primary }]
    };
  }

  /** Porcentaje (0–100) para ancho/altura de barra respecto al máximo del conjunto */
  barPercent(value: number, items: { label: string; value: number }[]): number {
    if (!items?.length || value <= 0) return 0;
    const max = Math.max(...items.map(i => i.value), 1);
    const pct = (value / max) * 100;
    return pct < 2 && value > 0 ? 2 : Math.round(pct);
  }

  /** Datos para donut (origen, país, dispositivo). limit opcional para top N (ej. 6 en países) */
  toDonutChartData(items: { label: string; value: number }[], limit?: number) {
    const list = limit ? items.slice(0, limit) : items;
    const filtered = list.filter(i => i.value > 0);
    if (!filtered.length) return { labels: [] as string[], datasets: [{ data: [], backgroundColor: [] as string[] }] };
    const colors = ['rgb(2, 163, 126)', 'rgba(2, 163, 126, 0.85)', 'rgba(2, 163, 126, 0.7)', 'rgba(2, 163, 126, 0.55)', 'rgba(2, 163, 126, 0.4)', 'rgba(2, 163, 126, 0.3)'];
    return {
      labels: filtered.map(i => i.label),
      datasets: [{
        data: filtered.map(i => i.value),
        backgroundColor: filtered.map((_, idx) => colors[idx % colors.length]),
        borderWidth: 0,
        hoverOffset: 4
      }]
    };
  }

  readonly donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#94a3b8', font: { size: 10 }, padding: 8 } }
    }
  };

  ngOnInit(): void {
    this.loadData();
  }

  setPeriod(p: TrafficPeriod): void {
    this.period.set(p);
    this.disabledSegments.set(new Set());
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    const p = this.period();
    this.trafficService.getTrafficOverview(p).subscribe({
      next: (o) => {
        this.overview.set(o);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
    this.contentService.getTopProjects(p).subscribe({
      next: (list) => this.topProjects.set(list)
    });
    this.contentService.getScrollCompletions(p).subscribe({
      next: (n) => this.scrollCompletions.set(n)
    });
    this.contentService.getClickEvents(p).subscribe({
      next: (e) => this.clickEvents.set(e)
    });
    this.trafficService.getTrafficTimeSeries(p).subscribe({
      next: (s) => this.trafficSeries.set(s)
    });
    this.trafficService.getSessionsByHour(p).subscribe({
      next: (list) => this.sessionsByHour.set(list)
    });
    this.trafficService.getTrafficBySource(p).subscribe({
      next: (list) => this.trafficBySource.set(list)
    });
    this.trafficService.getTrafficByCountry(p).subscribe({
      next: (list) => this.trafficByCountry.set(list)
    });
    this.trafficService.getTrafficByDevice(p).subscribe({
      next: (list) => this.trafficByDevice.set(list)
    });
    this.trafficService.getTrafficByBrowser(p).subscribe({
      next: (list) => this.trafficByBrowser.set(list)
    });
    this.trafficService.getTrafficByOs(p).subscribe({
      next: (list) => this.trafficByOs.set(list)
    });
  }

  formatDateShort(dateStr: string): string {
    if (!dateStr) return '';
    // GA4 devuelve YYYYMMDD (sin guiones) - new Date() falla y da NaN
    const cleaned = dateStr.replace(/-/g, '');
    if (cleaned.length >= 8) {
      const day = cleaned.slice(6, 8);
      const month = cleaned.slice(4, 6);
      return `${day}/${month}`;
    }
    const parsed = new Date(dateStr + 'T12:00:00');
    if (isNaN(parsed.getTime())) return dateStr;
    return `${String(parsed.getDate()).padStart(2, '0')}/${String(parsed.getMonth() + 1).padStart(2, '0')}`;
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
}
