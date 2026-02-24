import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  user?: UserResponse;
  mfaRequired?: boolean;
  challengeId?: string;
  challengeExpiresInSec?: number;
  methods?: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface VerifyTwoFactorLoginRequest {
  challengeId: string;
  code: string;
  trustThisDevice: boolean;
  deviceName?: string;
}

export interface TwoFactorStatusResponse {
  enabled: boolean;
}

export interface TwoFactorSetupInitResponse {
  manualKey: string;
  otpauthUri: string;
  qrDataUrl: string;
  expiresInSec: number;
}

export interface TwoFactorSetupVerifyResponse {
  status: number;
  message: string;
  requiresReLogin?: boolean;
}

export interface ApiStatusResponse {
  status: number;
  message: string;
}

export interface TrustedDeviceItem {
  id: number;
  deviceName: string;
  current?: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt: string;
}

export interface TrustedDevicesResponse {
  items: TrustedDeviceItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;

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

  verifyLogin2FA(data: VerifyTwoFactorLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login/2fa/verify`,
      data,
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

  getTwoFactorStatus(): Observable<TwoFactorStatusResponse> {
    return this.http.get<TwoFactorStatusResponse>(`${this.apiUrl}/2fa/status`, this.getOptions());
  }

  initTwoFactorSetup(): Observable<TwoFactorSetupInitResponse> {
    return this.http.post<TwoFactorSetupInitResponse>(`${this.apiUrl}/2fa/setup/init`, {}, this.getOptions());
  }

  verifyTwoFactorSetup(code: string): Observable<TwoFactorSetupVerifyResponse> {
    return this.http.post<TwoFactorSetupVerifyResponse>(
      `${this.apiUrl}/2fa/setup/verify`,
      { code },
      this.getOptions()
    );
  }

  disableTwoFactor(currentPassword: string, code: string): Observable<ApiStatusResponse> {
    return this.http.post<ApiStatusResponse>(`${this.apiUrl}/2fa/disable`, { currentPassword, code }, this.getOptions());
  }

  getTrustedDevices(): Observable<TrustedDevicesResponse> {
    return this.http.get<TrustedDevicesResponse>(`${this.apiUrl}/2fa/trusted-devices`, this.getOptions());
  }

  revokeTrustedDevice(deviceId: number): Observable<ApiStatusResponse> {
    return this.http.delete<ApiStatusResponse>(`${this.apiUrl}/2fa/trusted-devices/${deviceId}`, this.getOptions());
  }

  revokeAllTrustedDevices(): Observable<ApiStatusResponse> {
    return this.http.post<ApiStatusResponse>(`${this.apiUrl}/2fa/trusted-devices/revoke-all`, {}, this.getOptions());
  }
}
