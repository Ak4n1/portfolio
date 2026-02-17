import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  form: FormGroup;
  isSubmitting = false;
  state: 'form' | 'success' | 'error' = 'form';
  errorMessage = '';
  token = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.state = 'error';
        this.errorMessage = 'Token no encontrado. Usa el enlace del email.';
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  isConfirmInvalid(): boolean {
    const c = this.form.get('confirmPassword');
    return !!c && this.form.hasError('mismatch') && (c.dirty || c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting || !this.token) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    const newPassword = this.form.get('newPassword')?.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.state = 'success';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.state = 'error';
        this.errorMessage = err.error?.message || 'El enlace ha expirado o ya fue utilizado.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
