import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSearchItem } from '../models/user-search-item.model';
import { AdminUserListResponse } from '../models/admin-user-list-response.model';

const API_BASE = 'http://localhost:8080';
const USERS_BASE = `${API_BASE}/api/admin/users`;
const SEARCH_URL = `${USERS_BASE}/search`;

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private http = inject(HttpClient);

  searchUsers(params: { query: string; limit?: number }): Observable<UserSearchItem[]> {
    const httpParams = new HttpParams()
      .set('query', params.query.trim())
      .set('limit', String(params.limit ?? 10));
    return this.http.get<UserSearchItem[]>(SEARCH_URL, { params: httpParams });
  }

  list(params: { page?: number; size?: number; search?: string; enabled?: boolean | null; role?: string | null; onlineOnly?: boolean | null; offlineOnly?: boolean | null }): Observable<AdminUserListResponse> {
    let httpParams = new HttpParams()
      .set('page', String(params.page ?? 0))
      .set('size', String(params.size ?? 20));
    if (params.search?.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    if (params.enabled != null && params.enabled !== undefined) {
      httpParams = httpParams.set('enabled', String(params.enabled));
    }
    if (params.role?.trim()) {
      httpParams = httpParams.set('role', params.role.trim());
    }
    if (params.onlineOnly === true) {
      httpParams = httpParams.set('onlineOnly', 'true');
    }
    if (params.offlineOnly === true) {
      httpParams = httpParams.set('offlineOnly', 'true');
    }
    return this.http.get<AdminUserListResponse>(USERS_BASE, { params: httpParams });
  }

  updateEnabled(userId: number, enabled: boolean): Observable<void> {
    return this.http.patch<void>(`${USERS_BASE}/${userId}/enabled`, { enabled });
  }

  resendVerification(userId: number): Observable<void> {
    return this.http.post<void>(`${USERS_BASE}/${userId}/resend-verification`, null);
  }

  sendPasswordReset(userId: number): Observable<void> {
    return this.http.post<void>(`${USERS_BASE}/${userId}/send-password-reset`, null);
  }

  updateRoles(userId: number, roleNames: string[]): Observable<void> {
    return this.http.patch<void>(`${USERS_BASE}/${userId}/roles`, { roleNames });
  }

  /** Usuarios conectados vía WebSocket en tiempo real. */
  getOnlineUsersCount(): Observable<{ count: number; emails: string[] }> {
    return this.http.get<{ count: number; emails: string[] }>(`${USERS_BASE}/online-count`);
  }
}
