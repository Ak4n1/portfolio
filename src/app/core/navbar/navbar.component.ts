import { Component, inject, HostListener, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { AuthStateService } from '../services/auth-state.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  private authStateService = inject(AuthStateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = false;
  dropdownOpen = false;

  // Réplica de sistema_turnos: toSignal para reactividad automática al cambiar auth
  private authState = toSignal(this.authStateService.authState, {
    initialValue: { isAuthenticated: false, user: null, isLoading: true },
  });

  get currentTheme() {
    return this.themeService.getCurrentTheme();
  }

  get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  isAuthLoading = computed(() => this.authState()?.isLoading ?? true);
  isLoggedIn = computed(() => this.authState()?.isAuthenticated ?? false);
  user = computed(() => this.authState()?.user ?? null);
  userInitials = computed(() => {
    const u = this.authState()?.user;
    if (!u) return '';
    const first = (u.firstName || '').charAt(0).toUpperCase();
    const last = (u.lastName || '').charAt(0).toUpperCase();
    return (first + last) || '?';
  });

  @HostListener('document:click') onDocumentClick() {
    this.dropdownOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleDropdown(event?: Event) {
    event?.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.closeMenu();
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authStateService.setLoggedOut();
        this.closeDropdown();
        this.router.navigate(['/home']);
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
