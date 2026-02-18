import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  provider: 'OPENROUTER' | 'OPENAI' | 'ANTHROPIC';
  model: string;
  inDomain: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/chat`;

  sendMessage(payload: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, payload);
  }
}
