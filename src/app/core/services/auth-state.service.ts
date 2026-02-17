import { Injectable, inject, Injector } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService, UserResponse } from './auth.service';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private injector = inject(Injector);
  private initialized = false;

  private initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    isLoading: true,
  };

  private authStateSubject = new BehaviorSubject<AuthState>(this.initialState);
  readonly authState = this.authStateSubject.asObservable();

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Réplica de sistema_turnos: init con Injector + dynamic import,
   * setLoading explícito, clearState en error.
   */
  private async initializeAuthState(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    this.setLoading(true);

    try {
      const { AuthService } = await import('./auth.service');
      const authService = this.injector.get(AuthService);
      const res = await firstValueFrom(authService.refreshToken());

      if (res?.user) {
        this.setAuthenticated(res.user);
      } else {
        this.clearState();
      }
    } catch {
      this.clearState();
    } finally {
      this.setLoading(false);
    }
  }

  setAuthenticated(user: UserResponse): void {
    this.authStateSubject.next({
      isAuthenticated: true,
      user,
      isLoading: false,
    });
  }

  setLoggedOut(): void {
    this.clearState();
  }

  setLoading(loading: boolean): void {
    this.authStateSubject.next({
      ...this.authStateSubject.value,
      isLoading: loading,
    });
  }

  clearState(): void {
    this.authStateSubject.next({
      ...this.initialState,
      isLoading: false,
    });
  }

  async refreshUserState(): Promise<void> {
    if (!this.value.isAuthenticated) return;
    try {
      const { AuthService } = await import('./auth.service');
      const authService = this.injector.get(AuthService);
      const res = await firstValueFrom(authService.refreshToken());
      if (res?.user) this.setAuthenticated(res.user);
    } catch {
      this.clearState();
    }
  }

  get value(): AuthState {
    return this.authStateSubject.value;
  }
}
