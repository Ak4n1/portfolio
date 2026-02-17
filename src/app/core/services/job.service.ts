import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    JobOfferDto,
    ProfileSkillRequest,
    ProfileSkillResponse,
    AlertRuleRequest,
    AlertRuleResponse,
    JobSettingsRequest,
    JobSettingsResponse,
    JobSearchRunResponse,
    SearchNowResponse
} from '../models/job.models';

const API_BASE = 'http://localhost:8080';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private http = inject(HttpClient);

    /* ==================== Búsqueda ==================== */

    searchNow(): Observable<SearchNowResponse> {
        return this.http.post<SearchNowResponse>(`${API_BASE}/api/admin/jobs/search-now`, {}, {
            withCredentials: true
        });
    }

    getLastRun(): Observable<JobSearchRunResponse> {
        return this.http.get<JobSearchRunResponse>(`${API_BASE}/api/admin/jobs/last-run`, {
            withCredentials: true
        });
    }

    sendEmail(): Observable<SearchNowResponse> {
        return this.http.post<SearchNowResponse>(`${API_BASE}/api/admin/jobs/send-email`, {}, {
            withCredentials: true
        });
    }

    /* ==================== Profile Skills ==================== */

    listSkills(): Observable<ProfileSkillResponse[]> {
        return this.http.get<ProfileSkillResponse[]>(`${API_BASE}/api/admin/jobs/profile-skills`, {
            withCredentials: true
        });
    }

    createSkill(request: ProfileSkillRequest): Observable<ProfileSkillResponse> {
        return this.http.post<ProfileSkillResponse>(`${API_BASE}/api/admin/jobs/profile-skills`, request, {
            withCredentials: true
        });
    }

    updateSkill(id: number, request: ProfileSkillRequest): Observable<ProfileSkillResponse> {
        return this.http.put<ProfileSkillResponse>(`${API_BASE}/api/admin/jobs/profile-skills/${id}`, request, {
            withCredentials: true
        });
    }

    deleteSkill(id: number): Observable<void> {
        return this.http.delete<void>(`${API_BASE}/api/admin/jobs/profile-skills/${id}`, {
            withCredentials: true
        });
    }

    /* ==================== Alert Rules ==================== */

    listRules(): Observable<AlertRuleResponse[]> {
        return this.http.get<AlertRuleResponse[]>(`${API_BASE}/api/admin/jobs/alert-rules`, {
            withCredentials: true
        });
    }

    createRule(request: AlertRuleRequest): Observable<AlertRuleResponse> {
        return this.http.post<AlertRuleResponse>(`${API_BASE}/api/admin/jobs/alert-rules`, request, {
            withCredentials: true
        });
    }

    updateRule(id: number, request: AlertRuleRequest): Observable<AlertRuleResponse> {
        return this.http.put<AlertRuleResponse>(`${API_BASE}/api/admin/jobs/alert-rules/${id}`, request, {
            withCredentials: true
        });
    }

    deleteRule(id: number): Observable<void> {
        return this.http.delete<void>(`${API_BASE}/api/admin/jobs/alert-rules/${id}`, {
            withCredentials: true
        });
    }

    /* ==================== Settings ==================== */

    getSettings(): Observable<JobSettingsResponse> {
        return this.http.get<JobSettingsResponse>(`${API_BASE}/api/admin/jobs/settings`, {
            withCredentials: true
        });
    }

    updateSettings(request: JobSettingsRequest): Observable<JobSettingsResponse> {
        return this.http.put<JobSettingsResponse>(`${API_BASE}/api/admin/jobs/settings`, request, {
            withCredentials: true
        });
    }
}
