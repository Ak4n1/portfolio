import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { filter, take, timeout } from 'rxjs/operators';
import { AuthStateService } from '../../services/auth-state.service';

/**
 * Redirige /dashboard a /dashboard/user o /dashboard/admin según el rol del usuario.
 */
@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  imports: [],
  template: ''
})
export class DashboardRedirectComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    if (this.authStateService.value.isLoading) {
      try {
        await firstValueFrom(
          this.authStateService.authState.pipe(
            filter(s => !s.isLoading),
            take(1),
            timeout({ first: 5000 })
          )
        );
      } catch {}
    }

    const user = this.authStateService.value.user;
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    this.router.navigate([isAdmin ? '/dashboard/admin' : '/dashboard/user']);
  }
}
