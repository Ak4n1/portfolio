import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLogResponse } from '../models/activity-log-response.model';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  private http = inject(HttpClient);

  getRecent(limit = 20): Observable<ActivityLogResponse[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ActivityLogResponse[]>(`${API_BASE}/api/activity-logs`, { params });
  }
}
