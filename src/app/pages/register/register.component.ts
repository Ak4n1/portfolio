import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RegisterFormComponent } from '../../core/auth/register-form/register-form.component';
import { AuthService } from '../../core/services/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);

  serverError = '';

  ngOnInit(): void {
    if (this.authStateService.value.isAuthenticated) {
      this.router.navigate(['/home']);
      return;
    }
    firstValueFrom(this.authService.refreshToken()).then((res) => {
      if (res?.user) {
        this.authStateService.setAuthenticated(res.user);
        this.router.navigate(['/home']);
      }
    }).catch(() => {});
  }

  onSubmit(data: { name: string; apellido: string; email: string; password: string }): void {
    this.serverError = '';
    this.authService.register({
      email: data.email,
      password: data.password,
      firstName: data.name,
      lastName: data.apellido
    }).subscribe({
      next: (res) => this.router.navigate(['/verify-email-pending'], {
        queryParams: { email: res.user?.email || data.email }
      }),
      error: (err) => {
        this.serverError = err.error?.message || 'Error al registrarse. Intenta de nuevo.';
      }
    });
  }
}
