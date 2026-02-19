import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChatAuditConversationDetail,
  ChatAuditConversationListResponse,
} from '../models/chatbot-audit.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotAuditService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/admin/chatbot-config/audit`;

  getConversationsByUser(params: { userId: number; page?: number; size?: number }): Observable<ChatAuditConversationListResponse> {
    const httpParams = new HttpParams()
      .set('userId', String(params.userId))
      .set('page', String(params.page ?? 0))
      .set('size', String(params.size ?? 20));

    return this.http.get<ChatAuditConversationListResponse>(`${this.baseUrl}/conversations`, { params: httpParams });
  }

  getConversationDetail(conversationId: number): Observable<ChatAuditConversationDetail> {
    return this.http.get<ChatAuditConversationDetail>(`${this.baseUrl}/conversations/${conversationId}`);
  }
}
