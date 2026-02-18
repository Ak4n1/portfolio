import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatbotConfig, ChatbotProjectOption } from '../models/chatbot-config.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotConfigService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/admin/chatbot-config`;

  getConfig(): Observable<ChatbotConfig> {
    return this.http.get<ChatbotConfig>(this.apiUrl);
  }

  getPublicProjectOptions(): Observable<ChatbotProjectOption[]> {
    return this.http.get<ChatbotProjectOption[]>(`${this.apiUrl}/public-projects`);
  }

  updateConfig(payload: ChatbotConfig): Observable<ChatbotConfig> {
    return this.http.put<ChatbotConfig>(this.apiUrl, payload);
  }
}
