import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SystemNotificationsResponse } from '../models/system-notifications-response.model';
import { SystemNotificationResponse } from '../models/system-notification-response.model';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;
const NOTIFICATIONS_API = `${API_BASE}/api/notifications`;

@Injectable({
  providedIn: 'root',
})
export class UserNotificationService {
  private http = inject(HttpClient);

  /** Emite cuando el contador de no leídas puede haber cambiado. */
  private unreadCountChanged$ = new Subject<void>();

  getUnreadCountChanged(): Observable<void> {
    return this.unreadCountChanged$.asObservable();
  }

  notifyUnreadCountChanged(): void {
    this.unreadCountChanged$.next();
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  getNotifications(params: {
    page?: number;
    size?: number;
    type?: string;
    read?: boolean;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  } = {}): Observable<SystemNotificationsResponse> {
    let httpParams = new HttpParams();
    if (params.page != null) httpParams = httpParams.set('page', params.page);
    if (params.size != null) httpParams = httpParams.set('size', params.size);
    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.read != null) httpParams = httpParams.set('read', params.read);
    if (params.dateFrom) httpParams = httpParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) httpParams = httpParams.set('dateTo', params.dateTo);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<SystemNotificationsResponse>(NOTIFICATIONS_API, {
      ...this.getHttpOptions(),
      params: httpParams,
    }).pipe(
      catchError(() =>
        of({
          notifications: [],
          totalElements: 0,
          totalPages: 0,
          page: 0,
          size: params.size ?? 10,
          unreadCount: 0,
        })
      )
    );
  }

  getUnreadCount(params?: { excludeType?: string }): Observable<number> {
    let httpParams = new HttpParams();
    if (params?.excludeType) {
      httpParams = httpParams.set('excludeType', params.excludeType);
    }
    return this.http.get<number>(`${NOTIFICATIONS_API}/unread-count`, {
      ...this.getHttpOptions(),
      params: httpParams,
    }).pipe(
      catchError(() => of(0))
    );
  }

  markAsRead(id: number): Observable<SystemNotificationResponse> {
    return this.http.post<SystemNotificationResponse>(
      `${NOTIFICATIONS_API}/${id}/read`,
      {},
      this.getHttpOptions()
    );
  }

  markAllAsRead(): Observable<{ markedCount: number; message: string }> {
    return this.http.post<{ markedCount: number; message: string }>(
      `${NOTIFICATIONS_API}/read-all`,
      {},
      this.getHttpOptions()
    );
  }

  deleteNotification(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(
      `${NOTIFICATIONS_API}/${id}`,
      this.getHttpOptions()
    );
  }
}
