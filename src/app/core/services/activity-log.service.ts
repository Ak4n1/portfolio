import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLogResponse } from '../models/activity-log-response.model';

const API_BASE = 'http://localhost:8080';

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
