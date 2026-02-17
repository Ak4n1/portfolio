import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContactsResponse } from '../models/contacts-response.model';
import { ContactResponse } from '../models/contact-response.model';

const API_BASE = 'http://localhost:8080';
const CONTACT_API = `${API_BASE}/api/contact`;

@Injectable({
    providedIn: 'root',
})
export class AdminContactService {
    private http = inject(HttpClient);
    private apiUrl = CONTACT_API;

    private getHttpOptions() {
        return {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
    }

    getContacts(params: {
        page?: number;
        size?: number;
        read?: boolean;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
    } = {}): Observable<ContactsResponse> {
        let httpParams = new HttpParams();
        if (params.page != null) httpParams = httpParams.set('page', params.page);
        if (params.size != null) httpParams = httpParams.set('size', params.size);
        if (params.read != null) httpParams = httpParams.set('read', params.read);
        if (params.dateFrom) httpParams = httpParams.set('dateFrom', params.dateFrom);
        if (params.dateTo) httpParams = httpParams.set('dateTo', params.dateTo);
        if (params.search) httpParams = httpParams.set('search', params.search);

        return this.http.get<ContactsResponse>(this.apiUrl, {
            ...this.getHttpOptions(),
            params: httpParams,
        }).pipe(
            catchError(() =>
                of({
                    contacts: [],
                    totalElements: 0,
                    totalPages: 0,
                    page: 0,
                    size: params.size ?? 10,
                    unreadCount: 0,
                })
            )
        );
    }

    markAsRead(id: number): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
    }

    markAllAsRead(): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/mark-all-as-read`, {});
    }

    deleteContact(id: number): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}/${id}`,
            this.getHttpOptions()
        );
    }
}
