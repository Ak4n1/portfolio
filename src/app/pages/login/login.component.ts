import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { LoginFormComponent } from '../../core/auth/login-form/login-form.component';
import { AuthService } from '../../core/services/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);

  serverError = '';

  ngOnInit(): void {
    if (this.authStateService.value.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }
    // Si el estado dice "no logueado" pero hay cookies válidas (p. ej. interceptor limpió estado), restaurar sesión
    firstValueFrom(this.authService.refreshToken()).then((res) => {
      if (res?.user) {
        this.authStateService.setAuthenticated(res.user);
        this.router.navigate(['/dashboard']);
      }
    }).catch(() => {});
  }

  onClose(): void {
    this.router.navigate(['/home']);
  }

  onSubmit(data: { email: string; password: string }): void {
    this.serverError = '';
    this.authService.login(data.email, data.password).subscribe({
      next: (res) => {
        this.authStateService.setAuthenticated(res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 403 && err.error?.message?.includes('verificado')) {
          this.router.navigate(['/verify-email-pending'], {
            queryParams: { email: data.email, fromLogin: 'true' }
          });
          return;
        }
        this.serverError = err.error?.message || 'Email o contraseña inválidos';
      }
    });
  }
}
