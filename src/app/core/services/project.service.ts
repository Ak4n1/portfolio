import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Project, ProjectRequest, ImageUploadResponse } from '../models/project.model';

const API_BASE = 'http://localhost:8080';
const REQUEST_TIMEOUT_MS = 15000;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);

  list(visibleOnly = true): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_BASE}/api/projects?visibleOnly=${visibleOnly}`, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<Project> {
    console.log('[ProjectService] getById called, id:', id);
    if (!id || isNaN(id) || id < 1) {
      console.warn('[ProjectService] getById: ID inválido');
      return throwError(() => ({ error: { message: 'ID de proyecto inválido' } }));
    }
    const url = `${API_BASE}/api/projects/${id}`;
    console.log('[ProjectService] getById fetching:', url);
    return this.http.get<Project>(url, {
      withCredentials: true
    }).pipe(
      timeout(REQUEST_TIMEOUT_MS)
    );
  }

  create(request: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(`${API_BASE}/api/projects`, request, {
      withCredentials: true
    });
  }

  update(id: number, request: ProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${API_BASE}/api/projects/${id}`, request, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/api/projects/${id}`, {
      withCredentials: true
    });
  }

  uploadImage(projectId: number, file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageUploadResponse>(
      `${API_BASE}/api/projects/${projectId}/images`,
      formData,
      { withCredentials: true }
    );
  }

  deleteImage(projectId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(
      `${API_BASE}/api/projects/${projectId}/images/${imageId}`,
      { withCredentials: true }
    );
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  toggleLike(projectId: number): Observable<{ projectId: number, liked: boolean, likesCount: number }> {
    return this.http.post<{ projectId: number, liked: boolean, likesCount: number }>(
      `${API_BASE}/api/projects/${projectId}/like`,
      {},
      { withCredentials: true }
    );
  }

  getLikeStatus(projectId: number): Observable<{ projectId: number, liked: boolean, likesCount: number }> {
    return this.http.get<{ projectId: number, liked: boolean, likesCount: number }>(
      `${API_BASE}/api/projects/${projectId}/like/status`,
      { withCredentials: true }
    );
  }
}
