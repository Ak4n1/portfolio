import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service';

/**
 * Role Guard
 *
 * Protege rutas que requieren uno o más roles.
 * Uso: canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }
 */
export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles?.length) {
    if (!authStateService.value.isAuthenticated) {
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    return true;
  }

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

  const user = authStateService.value.user;
  if (!user?.roles?.length) {
    router.navigate(['/home']);
    return false;
  }

  const hasRole = requiredRoles.some((role) => user.roles.includes(role));
  if (!hasRole) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
