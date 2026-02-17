import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendBulkEmailRequest } from '../models/send-bulk-email-request.model';
import { SendBulkEmailResponse } from '../models/send-bulk-email-response.model';
import { CheckRecipientsRequest } from '../models/check-recipients-request.model';
import { CheckRecipientsResponse } from '../models/check-recipients-response.model';

const API_BASE = 'http://localhost:8080';
const SEND_URL = `${API_BASE}/api/admin/emails/send`;
const CHECK_RECIPIENTS_URL = `${API_BASE}/api/admin/emails/check-recipients`;

@Injectable({
  providedIn: 'root',
})
export class AdminEmailService {
  private http = inject(HttpClient);

  /**
   * Comprueba destinatarios y devuelve quiénes tienen la preferencia de email desactivada.
   * Llamar antes de enviar para mostrar el modal de excluidos.
   */
  checkRecipients(request: CheckRecipientsRequest): Observable<CheckRecipientsResponse> {
    return this.http.post<CheckRecipientsResponse>(CHECK_RECIPIENTS_URL, request);
  }

  /**
   * Envía email masivo con adjuntos opcionales.
   * Usa multipart/form-data: parte "request" (JSON) y opcionalmente "files".
   */
  sendBulkEmail(request: SendBulkEmailRequest, files: File[] = []): Observable<SendBulkEmailResponse> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    return this.http.post<SendBulkEmailResponse>(SEND_URL, formData);
  }
}
