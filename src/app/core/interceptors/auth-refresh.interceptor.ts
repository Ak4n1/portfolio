import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpStatusCode,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Ante 401 (token expirado), llama a refresh y reintenta el request.
 * Evita múltiples refreshes simultáneos.
 */
export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/register') ||
    req.url.includes('/api/auth/refresh')
  ) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        return handle401(req, next, authService, authStateService, router);
      }
      if (error.status === HttpStatusCode.Forbidden) {
        const msg = (error.error?.message || '') as string;
        if (msg.includes('verificado') || msg.includes('EMAIL_NOT_VERIFIED')) {
          const email = authStateService.value.user?.email ?? '';
          authStateService.setLoggedOut();
          router.navigate(['/verify-email-pending'], {
            queryParams: { email, fromLogin: 'true' },
          });
        }
      }
      return throwError(() => error);
    })
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  authStateService: AuthStateService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next('success');
        if (res.user) {
          authStateService.setAuthenticated(res.user);
        }
        return next(req);
      }),
      catchError((refreshErr: HttpErrorResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        if (refreshErr.status === HttpStatusCode.Forbidden) {
          const msg = (refreshErr.error?.message || '') as string;
          if (msg.includes('verificado') || msg.includes('EMAIL_NOT_VERIFIED')) {
            const email = authStateService.value.user?.email ?? '';
            authStateService.setLoggedOut();
            router.navigate(['/verify-email-pending'], {
              queryParams: { email, fromLogin: 'true' },
            });
            return throwError(() => refreshErr);
          }
        }
        authStateService.setLoggedOut();
        router.navigate(['/login']);
        return throwError(() => refreshErr);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((v) => v !== null),
    take(1),
    switchMap(() => next(req))
  );
}
