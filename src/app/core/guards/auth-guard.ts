import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service';

/**
 * Auth Guard
 *
 * Protege rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /login.
 * Espera a que la inicialización del estado termine antes de verificar.
 */
export const authGuard: CanActivateFn = async (route, state) => {
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
      // timeout o error: seguir con la verificación
    }
  }

  if (authStateService.value.isAuthenticated) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
