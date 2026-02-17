import { Component, inject, isDevMode, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, filter, take } from 'rxjs/operators';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { ThemeService } from './core/services/theme.service';
import { AuthStateService } from './core/services/auth-state.service';
import { WebSocketService } from './core/services/websocket.service';
import { PreloaderV2Component } from './shared/preloader-v2/preloader-v2.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, PreloaderV2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private authStateService = inject(AuthStateService);
  private webSocketService = inject(WebSocketService);
  private router = inject(Router);

  title = 'portafolio';
  preloaderDone = signal(false);
  preloaderExiting = signal(false);
  navigationReady = signal(false);

  isDashboardRoute = toSignal(
    this.router.events.pipe(
      map(() => this.router.url.startsWith('/dashboard')),
      startWith(this.router.url.startsWith('/dashboard'))
    ),
    { initialValue: this.router.url.startsWith('/dashboard') }
  );

  ngOnInit(): void {
    this.themeService.getCurrentTheme();
    if (this.preloaderDone()) {
      this.markPreloaderCompleted();
    }

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd | NavigationError | NavigationCancel =>
          e instanceof NavigationEnd || e instanceof NavigationError || e instanceof NavigationCancel
        ),
        take(1)
      )
      .subscribe(() => this.navigationReady.set(true));
  }

  onPreloaderComplete(): void {
    this.preloaderExiting.set(false);
    this.preloaderDone.set(true);
    this.markPreloaderCompleted();
  }

  onPreloaderExitStart(): void {
    this.preloaderExiting.set(true);
  }

  private markPreloaderCompleted(): void {
    (window as any).__preloaderCompleted = true;
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }
}
