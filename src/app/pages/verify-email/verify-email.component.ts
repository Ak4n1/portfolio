import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  state: 'verifying' | 'success' | 'error' = 'verifying';
  errorMessage = '';
  isRetrying = false;
  token = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.verifyEmail();
      } else {
        this.state = 'error';
        this.errorMessage = 'Token no proporcionado. Usa el enlace del email.';
      }
    });
  }

  verifyEmail(): void {
    if (!this.token || this.isRetrying) return;

    this.state = 'verifying';
    this.errorMessage = '';
    this.isRetrying = false;

    this.authService.verifyEmail(this.token).subscribe({
      next: () => {
        this.state = 'success';
      },
      error: (err) => {
        this.state = 'error';
        this.isRetrying = false;
        this.errorMessage = err.error?.message || 'Token inválido o expirado.';
      }
    });
  }

  retry(): void {
    this.isRetrying = true;
    this.verifyEmail();
  }

  goToResendVerification(): void {
    this.router.navigate(['/verify-email-pending']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
