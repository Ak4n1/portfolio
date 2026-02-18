import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsBroadcast } from '../models/project.model';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;

export interface CreateNewsRequest {
    title: string;
    content: string;
}

export interface NewsAdminPageResponse {
    news: NewsBroadcast[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private http = inject(HttpClient);

    getAll(): Observable<NewsBroadcast[]> {
        return this.http.get<NewsBroadcast[]>(`${API_BASE}/api/news`, {
            withCredentials: true
        });
    }

    getAdminPage(params: {
        page?: number;
        size?: number;
        search?: string;
        from?: string;
        to?: string;
    } = {}): Observable<NewsAdminPageResponse> {
        let httpParams = new HttpParams();
        if (params.page != null) httpParams = httpParams.set('page', params.page);
        if (params.size != null) httpParams = httpParams.set('size', params.size);
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.from) httpParams = httpParams.set('from', params.from);
        if (params.to) httpParams = httpParams.set('to', params.to);

        return this.http.get<NewsAdminPageResponse>(`${API_BASE}/api/news/admin`, {
            withCredentials: true,
            params: httpParams
        });
    }

    post(news: CreateNewsRequest): Observable<NewsBroadcast> {
        return this.http.post<NewsBroadcast>(`${API_BASE}/api/news`, news, {
            withCredentials: true
        });
    }

    update(newsId: number, news: CreateNewsRequest): Observable<NewsBroadcast> {
        return this.http.put<NewsBroadcast>(`${API_BASE}/api/news/${newsId}`, news, {
            withCredentials: true
        });
    }

    delete(newsId: number): Observable<void> {
        return this.http.delete<void>(`${API_BASE}/api/news/${newsId}`, {
            withCredentials: true
        });
    }
}
