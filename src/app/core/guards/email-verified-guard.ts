import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service';

/**
 * Email Verified Guard
 *
 * Protege rutas que requieren email verificado.
 * Si no está autenticado, redirige a /login.
 * Si está autenticado pero el email no está verificado, redirige a /verify-email-pending.
 */
export const emailVerifiedGuard: CanActivateFn = async (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (authStateService.value.isLoading) {
    try {
      await firstValueFrom(
        authStateService.authState.pipe(
          filter((s) => !s.isLoading),
          take(1),
          timeout({ first: 5000 })
        )
      );
    } catch {
      // timeout o error
    }
  }

  if (!authStateService.value.isAuthenticated) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const emailVerified = authStateService.value.user?.emailVerified ?? false;
  if (!emailVerified) {
    const email = authStateService.value.user?.email ?? '';
    router.navigate(['/verify-email-pending'], {
      queryParams: { email, fromLogin: 'true' },
    });
    return false;
  }

  return true;
};
