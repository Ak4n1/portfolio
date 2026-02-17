import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  submitForm = output<{ name: string; apellido: string; email: string; password: string }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  isConfirmPasswordInvalid(): boolean {
    const c = this.form.get('confirmPassword');
    return !!c && this.form.hasError('mismatch') && (c?.dirty || c?.touched);
  }

  showPassword = false;
  showConfirmPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { name, apellido, email, password } = this.form.value;
      this.submitForm.emit({ name, apellido, email, password });
    } else {
      Object.keys(this.form.controls).forEach((k) => this.form.get(k)?.markAsTouched());
    }
  }
}
