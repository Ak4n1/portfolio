import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  form: FormGroup;
  isSubmitting = false;
  success = false;
  errorMessage = '';
  submittedEmail = '';

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.success = false;
    this.errorMessage = '';
    const email = this.form.get('email')?.value;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.success = true;
        this.submittedEmail = email;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al solicitar. Intenta más tarde.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToResendVerification(): void {
    const email = this.form.get('email')?.value;
    this.router.navigate(['/verify-email-pending'], { queryParams: { email } });
  }
}
