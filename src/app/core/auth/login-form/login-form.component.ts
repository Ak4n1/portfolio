import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  submitForm = output<{ email: string; password: string }>();
  close = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      Object.keys(this.form.controls).forEach((k) => this.form.get(k)?.markAsTouched());
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
