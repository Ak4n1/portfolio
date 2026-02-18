import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendManualNotificationRequest } from '../models/send-manual-notification-request.model';
import { SendManualNotificationResponse } from '../models/send-manual-notification-response.model';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;
const SEND_URL = `${API_BASE}/api/admin/notifications/send`;

@Injectable({
  providedIn: 'root',
})
export class AdminManualNotificationService {
  private http = inject(HttpClient);

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  sendManualNotification(body: SendManualNotificationRequest): Observable<SendManualNotificationResponse> {
    return this.http.post<SendManualNotificationResponse>(SEND_URL, body, this.getHttpOptions());
  }
}
