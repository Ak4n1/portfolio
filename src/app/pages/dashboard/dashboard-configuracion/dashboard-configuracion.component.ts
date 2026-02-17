import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService, UserResponse, UpdateProfileRequest } from '../../../core/services/auth.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ConfirmModalComponent } from '../../../core/components/confirm-modal/confirm-modal.component';

function passwordMismatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const g = group as FormGroup;
    const newP = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    if (newP !== confirm && confirm !== '') return { passwordMismatch: true };
    return null;
  };
}

@Component({
  selector: 'app-dashboard-configuracion',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './dashboard-configuracion.component.html',
  styleUrls: ['./dashboard-configuracion.component.css'],
})
export class DashboardConfiguracionComponent implements OnInit {
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profile = signal<UserResponse | null>(null);
  loadError = signal<string | null>(null);
  savingProfile = signal(false);
  savingPassword = signal(false);
  receiveEmails = signal(true);
  confirmDisableVisible = signal(false);

  // Password visibility toggles
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  /** Mensaje de error al guardar preferencia de emails (p. ej. si el backend no persiste). */
  receiveEmailsError = signal<string | null>(null);

  toggleCurrentPassword() { this.showCurrentPassword.update(v => !v); }
  toggleNewPassword() { this.showNewPassword.update(v => !v); }
  toggleConfirmPassword() { this.showConfirmPassword.update(v => !v); }

  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }],
  });

  passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMismatchValidator() }
  );

  memberSinceFormatted = computed(() => {
    const p = this.profile();
    if (!p?.createdAt) return '—';
    const d = new Date(p.createdAt);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  });

  confirmDisableMessage = computed(() =>
    'Tu cuenta se deshabilitará y no podrás iniciar sesión hasta que un administrador la reactive. ¿Continuar?'
  );

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadError.set(null);
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.profile.set(user);
        this.profileForm.patchValue({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
        });
        this.receiveEmails.set(user.receiveNotificationEmails ?? true);
      },
      error: () => this.loadError.set('No se pudo cargar el perfil.'),
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const v = this.profileForm.getRawValue();
    const payload: UpdateProfileRequest = {
      firstName: v.firstName?.trim(),
      lastName: v.lastName?.trim(),
      receiveNotificationEmails: this.receiveEmails(),
    };
    this.savingProfile.set(true);
    this.authService.updateProfile(payload).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.authStateService.setAuthenticated(updated);
        this.savingProfile.set(false);
      },
      error: () => this.savingProfile.set(false),
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;
    const v = this.passwordForm.getRawValue();
    this.savingPassword.set(true);
    this.authService.changePassword(v.currentPassword, v.newPassword).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.savingPassword.set(false);
      },
      error: () => this.savingPassword.set(false),
    });
  }

  goToForgotPassword(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authStateService.setLoggedOut();
        this.router.navigate(['/forgot-password']);
      },
    });
  }

  toggleReceiveEmails(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const previous = this.receiveEmails();
    this.receiveEmails.set(checked);
    this.receiveEmailsError.set(null);
    this.authService.updateProfile({ receiveNotificationEmails: checked }).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.authStateService.setAuthenticated(updated);
        this.receiveEmails.set(updated.receiveNotificationEmails ?? checked);
      },
      error: () => {
        this.receiveEmails.set(previous);
        this.receiveEmailsError.set('No se pudo guardar la preferencia. Comprueba la conexión o contacta soporte.');
      },
    });
  }

  openDisableAccountModal(): void {
    this.confirmDisableVisible.set(true);
  }

  closeDisableAccountModal(): void {
    this.confirmDisableVisible.set(false);
  }

  onConfirmDisableAccount(): void {
    this.authService.disableAccount().subscribe({
      next: () => {
        this.closeDisableAccountModal();
        this.authStateService.setLoggedOut();
        window.location.href = '/';
      },
      error: () => this.closeDisableAccountModal(),
    });
  }
}
