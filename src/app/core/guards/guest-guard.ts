import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service';
import { AuthService } from '../services/auth.service';

/**
 * Guest Guard
 *
 * Protege rutas que solo deben ser accesibles para usuarios NO autenticados
 * (ej. login, register). Si el usuario está logueado, redirige a /home.
 * Si el estado dice "no logueado" pero hay cookies válidas, intenta restaurar sesión una vez.
 */
export const guestGuard: CanActivateFn = async (route, state) => {
  const authStateService = inject(AuthStateService);
  const authService = inject(AuthService);
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
    router.navigate(['/dashboard']);
    return false;
  }

  // Estado dice "no logueado" pero puede haber cookies válidas (p. ej. init falló o interceptor limpió estado).
  // Intentar restaurar sesión una vez antes de mostrar login/register.
  try {
    const res = await firstValueFrom(
      authService.refreshToken().pipe(timeout({ first: 4000 }))
    );
    if (res?.user) {
      authStateService.setAuthenticated(res.user);
      router.navigate(['/dashboard']);
      return false;
    }
  } catch {
    // Sin sesión válida; permitir acceso a login/register
  }

  return true;
};
