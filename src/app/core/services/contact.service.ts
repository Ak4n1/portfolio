import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  status: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/contact';

  submit(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, request, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
    });
  }
}
