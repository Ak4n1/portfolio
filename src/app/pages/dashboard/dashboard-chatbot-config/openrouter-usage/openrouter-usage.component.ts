import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenRouterService, OpenRouterUsage } from '../../../../core/services/openrouter.service';

@Component({
  selector: 'app-openrouter-usage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './openrouter-usage.component.html',
  styleUrl: './openrouter-usage.component.css',
})
export class OpenRouterUsageComponent implements OnInit, OnDestroy {
  private readonly openRouterService = inject(OpenRouterService);
  private readonly AUTO_REFRESH_MS = 60000;

  usage = signal<OpenRouterUsage | null>(null);
  loading = signal(true);
  refreshing = signal(false);
  error = signal<string | null>(null);

  private autoRefreshId: ReturnType<typeof setInterval> | null = null;

  hasLowRemaining = computed(() => {
    const data = this.usage();
    if (!data || data.limit <= 0) return false;
    return data.limitRemaining / data.limit < 0.2;
  });

  remainingPercent = computed(() => {
    const data = this.usage();
    if (!data || data.limit <= 0) return 0;
    return this.toPercent(data.limitRemaining, data.limit);
  });

  usageDailyPercent = computed(() => {
    const data = this.usage();
    if (!data || data.limit <= 0) return 0;
    return this.toPercent(data.usageDaily, data.limit);
  });

  usageMonthlyPercent = computed(() => {
    const data = this.usage();
    if (!data || data.limit <= 0) return 0;
    return this.toPercent(data.usageMonthly, data.limit);
  });

  ngOnInit(): void {
    this.loadUsage();
    // Listo para activarse cuando quieras auto-refresh:
    // this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadUsage(): void {
    this.loading.set(true);
    this.error.set(null);

    this.openRouterService.getUsage().subscribe({
      next: (data) => {
        this.usage.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  refresh(): void {
    if (this.loading() || this.refreshing()) return;
    this.refreshing.set(true);
    this.error.set(null);

    this.openRouterService.getUsage().subscribe({
      next: (data) => {
        this.usage.set(data);
        this.refreshing.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.refreshing.set(false);
      },
    });
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.autoRefreshId = setInterval(() => this.refresh(), this.AUTO_REFRESH_MS);
  }

  private stopAutoRefresh(): void {
    if (!this.autoRefreshId) return;
    clearInterval(this.autoRefreshId);
    this.autoRefreshId = null;
  }

  private toPercent(value: number, total: number): number {
    if (total <= 0) return 0;
    const raw = (value / total) * 100;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }
}
