import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OpenRouterUsage {
  limit: number;
  limitRemaining: number;
  usage: number;
  usageDaily: number;
  usageWeekly: number;
  usageMonthly: number;
  isFreeTier: boolean;
}

interface OpenRouterKeyRawResponse {
  data?: {
    limit?: number;
    limit_remaining?: number;
    usage?: number;
    usage_daily?: number;
    usage_weekly?: number;
    usage_monthly?: number;
    is_free_tier?: boolean;
  };
  limit?: number;
  limit_remaining?: number;
  usage?: number;
  usage_daily?: number;
  usage_weekly?: number;
  usage_monthly?: number;
  is_free_tier?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OpenRouterService {
  private readonly http = inject(HttpClient);
  private readonly usageApiUrl = `${environment.apiBaseUrl}/api/admin/chatbot-config/openrouter-usage`;

  getUsage(): Observable<OpenRouterUsage> {
    return this.http.get<OpenRouterKeyRawResponse>(this.usageApiUrl).pipe(
      map((raw) => this.normalize(raw)),
      catchError((error: HttpErrorResponse) => throwError(() => this.toUserError(error)))
    );
  }

  private normalize(raw: OpenRouterKeyRawResponse): OpenRouterUsage {
    const payload = raw.data ?? raw;
    return {
      limit: this.toNumber(payload.limit),
      limitRemaining: this.toNumber(payload.limit_remaining),
      usage: this.toNumber(payload.usage),
      usageDaily: this.toNumber(payload.usage_daily),
      usageWeekly: this.toNumber(payload.usage_weekly),
      usageMonthly: this.toNumber(payload.usage_monthly),
      isFreeTier: Boolean(payload.is_free_tier),
    };
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return 0;
  }

  private toUserError(error: HttpErrorResponse): Error {
    if (error.status === 401) {
      return new Error('No autorizado para consultar OpenRouter (401). Revisa la API key en backend.');
    }
    if (error.status === 429) {
      return new Error('OpenRouter rate limit alcanzado (429). Espera un momento e intenta de nuevo.');
    }
    if (error.status === 0) {
      return new Error('No se pudo conectar al backend para consultar OpenRouter.');
    }
    const backendMessage =
      typeof error.error?.message === 'string' && error.error.message.trim()
        ? error.error.message.trim()
        : null;
    return new Error(backendMessage ?? `No se pudo obtener uso de OpenRouter (${error.status}).`);
  }
}
