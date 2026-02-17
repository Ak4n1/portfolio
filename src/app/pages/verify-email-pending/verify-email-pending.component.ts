import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify-email-pending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email-pending.component.html',
  styleUrl: './verify-email-pending.component.css'
})
export class VerifyEmailPendingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  isResending = false;
  resendSuccess = false;
  resendError = '';
  showSuccessMessage = false;
  fromLogin = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.fromLogin = params['fromLogin'] === 'true';
      this.showSuccessMessage = !!this.email && !this.fromLogin;
    });
  }

  resendVerificationEmail(): void {
    if (!this.email || this.isResending) return;

    this.isResending = true;
    this.resendSuccess = false;
    this.resendError = '';

    this.authService.resendVerification(this.email).subscribe({
      next: () => {
        this.isResending = false;
        this.resendSuccess = true;
      },
      error: (err) => {
        this.isResending = false;
        this.resendError = err.error?.message || 'Error al reenviar. Intenta más tarde.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
