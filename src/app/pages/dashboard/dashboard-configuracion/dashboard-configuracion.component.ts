import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService, UserResponse, UpdateProfileRequest, TwoFactorSetupInitResponse, TrustedDeviceItem } from '../../../core/services/auth.service';
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
  twoFactorEnabled = signal(false);
  loadingTwoFactor = signal(false);
  enablingTwoFactor = signal(false);
  twoFactorInitData = signal<TwoFactorSetupInitResponse | null>(null);
  twoFactorCode = signal('');
  twoFactorError = signal<string | null>(null);
  twoFactorInfo = signal<string | null>(null);
  showManualSetup = signal(false);
  trustedDevices = signal<TrustedDeviceItem[]>([]);
  trustedDevicesLoading = signal(false);
  trustedDevicesModalVisible = signal(false);
  disablingTwoFactor = signal(false);
  disableTwoFactorPassword = signal('');
  disableTwoFactorCode = signal('');
  confirmDisableTwoFactorVisible = signal(false);
  manualKeyCopied = signal(false);

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

  confirmDisableTwoFactorMessage = computed(() =>
    'Se desactivara 2FA en tu cuenta. En Google Authenticator, elimina manualmente el codigo anterior para evitar confusiones futuras. Quieres continuar?'
  );

  ngOnInit(): void {
    this.loadProfile();
    this.loadTwoFactorStatus();
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
      error: () => {
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

  loadTwoFactorStatus(): void {
    this.loadingTwoFactor.set(true);
    this.authService.getTwoFactorStatus().subscribe({
      next: (res) => {
        this.twoFactorEnabled.set(!!res.enabled);
        this.loadingTwoFactor.set(false);
      },
      error: () => {
        this.loadingTwoFactor.set(false);
        this.twoFactorError.set('No se pudo consultar el estado de 2FA.');
      },
    });
  }

  initTwoFactor(): void {
    this.twoFactorError.set(null);
    this.twoFactorInfo.set(null);
    this.enablingTwoFactor.set(true);
    this.authService.initTwoFactorSetup().subscribe({
      next: (res) => {
        this.twoFactorInitData.set(res);
        this.showManualSetup.set(false);
        this.enablingTwoFactor.set(false);
      },
      error: (err) => {
        this.twoFactorError.set(err?.error?.message || 'No se pudo iniciar la configuración de 2FA.');
        this.enablingTwoFactor.set(false);
      },
    });
  }

  setTwoFactorCode(value: string): void {
    this.twoFactorCode.set((value || '').replace(/[^0-9]/g, '').slice(0, 6));
  }

  toggleManualSetup(): void {
    this.showManualSetup.update((v) => !v);
    this.manualKeyCopied.set(false);
  }

  copyManualKey(value: string): void {
    const key = (value || '').trim();
    if (!key) return;
    navigator.clipboard.writeText(key).then(() => {
      this.manualKeyCopied.set(true);
      setTimeout(() => this.manualKeyCopied.set(false), 1800);
    });
  }

  closeTwoFactorSetup(): void {
    this.twoFactorInitData.set(null);
    this.twoFactorCode.set('');
    this.showManualSetup.set(false);
    this.manualKeyCopied.set(false);
    this.twoFactorError.set(null);
  }

  verifyAndEnableTwoFactor(): void {
    if (this.twoFactorCode().length < 6) return;
    this.twoFactorError.set(null);
    this.twoFactorInfo.set(null);
    this.enablingTwoFactor.set(true);
    this.authService.verifyTwoFactorSetup(this.twoFactorCode()).subscribe({
      next: (res) => {
        this.enablingTwoFactor.set(false);
        this.twoFactorEnabled.set(true);
        this.twoFactorInfo.set(res.message || '2FA activado.');
        this.twoFactorCode.set('');
        this.twoFactorInitData.set(null);
        if (res.requiresReLogin) {
          this.authStateService.setLoggedOut();
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.enablingTwoFactor.set(false);
        this.twoFactorError.set(err?.error?.message || 'Código 2FA inválido.');
      },
    });
  }

  openTrustedDevicesModal(): void {
    this.trustedDevicesModalVisible.set(true);
    this.loadTrustedDevices();
  }

  closeTrustedDevicesModal(): void {
    this.trustedDevicesModalVisible.set(false);
  }

  loadTrustedDevices(): void {
    this.trustedDevicesLoading.set(true);
    this.authService.getTrustedDevices().subscribe({
      next: (res) => {
        this.trustedDevices.set(res.items ?? []);
        this.trustedDevicesLoading.set(false);
      },
      error: () => {
        this.trustedDevicesLoading.set(false);
        this.twoFactorError.set('No se pudieron cargar los dispositivos confiables.');
      },
    });
  }

  revokeTrustedDevice(deviceId: number): void {
    const target = this.trustedDevices().find((d) => d.id === deviceId);
    if (target?.current) {
      this.twoFactorInfo.set('Este es tu dispositivo actual. No se puede revocar desde esta sesion.');
      return;
    }
    this.authService.revokeTrustedDevice(deviceId).subscribe({
      next: (res) => {
        this.twoFactorInfo.set(res.message);
        this.loadTrustedDevices();
      },
      error: (err) => {
        this.twoFactorError.set(err?.error?.message || 'No se pudo revocar el dispositivo.');
      },
    });
  }

  revokeAllTrustedDevices(): void {
    const hasRevokable = this.trustedDevices().some((d) => !d.current);
    if (!hasRevokable) {
      this.twoFactorInfo.set('No hay otros dispositivos para revocar.');
      return;
    }
    this.authService.revokeAllTrustedDevices().subscribe({
      next: (res) => {
        this.twoFactorInfo.set(res.message);
        this.loadTrustedDevices();
      },
      error: (err) => {
        this.twoFactorError.set(err?.error?.message || 'No se pudieron revocar los dispositivos.');
      },
    });
  }

  disableTwoFactorNow(): void {
    if (!this.disableTwoFactorPassword() || this.disableTwoFactorCode().length < 6) return;
    this.disablingTwoFactor.set(true);
    this.twoFactorError.set(null);
    this.twoFactorInfo.set(null);
    this.authService.disableTwoFactor(this.disableTwoFactorPassword(), this.disableTwoFactorCode()).subscribe({
      next: (res) => {
        this.disablingTwoFactor.set(false);
        this.twoFactorEnabled.set(false);
        this.disableTwoFactorPassword.set('');
        this.disableTwoFactorCode.set('');
        this.twoFactorInfo.set(res.message);
        this.authService.logout().subscribe({
          next: () => {
            this.authStateService.setLoggedOut();
            this.router.navigate(['/login'], { replaceUrl: true, queryParams: { reason: '2fa-disabled' } });
          },
          error: () => {
            this.authStateService.setLoggedOut();
            this.router.navigate(['/login'], { replaceUrl: true, queryParams: { reason: '2fa-disabled' } });
          },
        });
      },
      error: (err) => {
        this.disablingTwoFactor.set(false);
        this.twoFactorError.set(err?.error?.message || 'No se pudo desactivar 2FA.');
      },
    });
  }

  openDisableTwoFactorModal(): void {
    if (this.disablingTwoFactor() || !this.disableTwoFactorPassword() || this.disableTwoFactorCode().length < 6) return;
    this.confirmDisableTwoFactorVisible.set(true);
  }

  closeDisableTwoFactorModal(): void {
    this.confirmDisableTwoFactorVisible.set(false);
  }

  onConfirmDisableTwoFactor(): void {
    this.closeDisableTwoFactorModal();
    this.disableTwoFactorNow();
  }

  setDisableTwoFactorPassword(value: string): void {
    this.disableTwoFactorPassword.set(value ?? '');
  }

  setDisableTwoFactorCode(value: string): void {
    this.disableTwoFactorCode.set((value || '').replace(/[^0-9]/g, '').slice(0, 6));
  }
}
