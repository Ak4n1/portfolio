import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
  createdAt?: string;
  receiveNotificationEmails?: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  receiveNotificationEmails?: boolean;
}

export interface AuthResponse {
  user: UserResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  private getOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      { email, password },
      this.getOptions()
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data,
      this.getOptions()
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/logout`, {}, this.getOptions());
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, this.getOptions());
  }

  getProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`, this.getOptions());
  }

  updateProfile(data: UpdateProfileRequest): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/me`, data, this.getOptions());
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, { currentPassword, newPassword }, this.getOptions());
  }

  disableAccount(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/disable-account`, {}, this.getOptions());
  }

  forgotPassword(email: string): Observable<{ status: number; message: string }> {
    return this.http.post<{ status: number; message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email },
      this.getOptions()
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ status: number; message: string }> {
    return this.http.post<{ status: number; message: string }>(
      `${this.apiUrl}/reset-password/${token}`,
      { newPassword },
      this.getOptions()
    );
  }

  verifyEmail(token: string): Observable<{ status: number; message: string }> {
    return this.http.get<{ status: number; message: string }>(
      `${this.apiUrl}/verify-email?token=${encodeURIComponent(token)}`,
      this.getOptions()
    );
  }

  resendVerification(email: string): Observable<{ status: number; message: string }> {
    return this.http.post<{ status: number; message: string }>(
      `${this.apiUrl}/resend-verification?email=${encodeURIComponent(email)}`,
      {},
      this.getOptions()
    );
  }
}
