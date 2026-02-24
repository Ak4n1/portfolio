import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from '../../core/auth/login-form/login-form.component';
import { AuthService } from '../../core/services/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginFormComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);

  serverError = '';
  pendingChallengeId: string | null = null;
  mfaCode = '';
  trustThisDevice = true;
  challengeExpiresInSec = 0;
  private challengeCountdownId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    if (reason === '2fa-disabled') {
      this.serverError = 'Se desactivo 2FA y por seguridad cerramos tu sesion. Inicia sesion nuevamente.';
    }

    if (this.authStateService.value.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  ngOnDestroy(): void {
    this.clearChallengeCountdown();
  }

  onClose(): void {
    this.router.navigate(['/home']);
  }

  onSubmit(data: { email: string; password: string }): void {
    this.serverError = '';
    this.authService.login(data.email, data.password).subscribe({
      next: (res) => {
        if (res.mfaRequired && res.challengeId) {
          this.pendingChallengeId = res.challengeId;
          this.mfaCode = '';
          this.challengeExpiresInSec = res.challengeExpiresInSec ?? 300;
          this.startChallengeCountdown();
          return;
        }

        if (res.user) {
          this.authStateService.setAuthenticated(res.user);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        if (err.status === 403 && err.error?.message?.includes('verificado')) {
          this.router.navigate(['/verify-email-pending'], {
            queryParams: { email: data.email, fromLogin: 'true' }
          });
          return;
        }
        this.serverError = err.error?.message || 'Email o password invalidos';
      }
    });
  }

  onSubmitMfa(): void {
    if (!this.pendingChallengeId) return;
    this.serverError = '';
    this.authService.verifyLogin2FA({
      challengeId: this.pendingChallengeId,
      code: this.mfaCode,
      trustThisDevice: this.trustThisDevice,
      deviceName: 'Browser'
    }).subscribe({
      next: (res) => {
        this.clearChallengeState();
        if (res.user) {
          this.authStateService.setAuthenticated(res.user);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Codigo 2FA invalido';
      }
    });
  }

  cancelMfaStep(): void {
    this.clearChallengeState();
    this.serverError = '';
  }

  private startChallengeCountdown(): void {
    this.clearChallengeCountdown();
    this.challengeCountdownId = setInterval(() => {
      if (this.challengeExpiresInSec <= 0) {
        this.serverError = 'El desafio 2FA expiro. Vuelve a iniciar sesion.';
        this.clearChallengeState();
        return;
      }
      this.challengeExpiresInSec -= 1;
    }, 1000);
  }

  private clearChallengeCountdown(): void {
    if (this.challengeCountdownId) {
      clearInterval(this.challengeCountdownId);
      this.challengeCountdownId = null;
    }
  }

  private clearChallengeState(): void {
    this.clearChallengeCountdown();
    this.pendingChallengeId = null;
    this.mfaCode = '';
    this.challengeExpiresInSec = 0;
  }
}
