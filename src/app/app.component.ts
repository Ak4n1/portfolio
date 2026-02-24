import { Component, inject, isDevMode, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Title } from '@angular/platform-browser';
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
  private titleService = inject(Title);

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
    this.updateDocumentTitle(this.router.url);
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

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateDocumentTitle(e.urlAfterRedirects));
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

  private updateDocumentTitle(url: string): void {
    const routeTitle = this.resolveRouteTitle(url);
    this.titleService.setTitle(`Juan Encabo | ${routeTitle}`);
  }

  private resolveRouteTitle(url: string): string {
    const cleanUrl = url.split('?')[0].split('#')[0];

    if (cleanUrl === '/' || cleanUrl === '/home') return 'Inicio';
    if (cleanUrl === '/about') return 'Sobre mi';
    if (cleanUrl === '/projects') return 'Proyectos';
    if (cleanUrl === '/contact') return 'Contacto';
    if (cleanUrl === '/skills') return 'Skills';
    if (cleanUrl === '/login') return 'Iniciar sesion';
    if (cleanUrl === '/register') return 'Registro';
    if (cleanUrl === '/verify-email-pending') return 'Verificar email';
    if (cleanUrl === '/verify-email') return 'Confirmar email';
    if (cleanUrl === '/forgot-password') return 'Recuperar contrasena';
    if (cleanUrl.startsWith('/reset-password/')) return 'Restablecer contrasena';
    if (cleanUrl.startsWith('/project/')) return 'Detalle de proyecto';

    if (cleanUrl === '/dashboard' || cleanUrl === '/dashboard/') return 'Dashboard';
    if (cleanUrl === '/dashboard/admin') return 'Inicio';
    if (cleanUrl === '/dashboard/user') return 'Panel';
    if (cleanUrl === '/dashboard/chat') return 'Chat IA';
    if (cleanUrl === '/dashboard/notificaciones') return 'Notificaciones';
    if (cleanUrl === '/dashboard/projects') return 'Proyectos';
    if (cleanUrl === '/dashboard/projects/new') return 'Nuevo proyecto';
    if (cleanUrl.startsWith('/dashboard/projects/')) return 'Editar proyecto';
    if (cleanUrl === '/dashboard/noticias') return 'Noticias';
    if (cleanUrl === '/dashboard/usuarios') return 'Usuarios';
    if (cleanUrl === '/dashboard/contactos') return 'Mensajes';
    if (cleanUrl === '/dashboard/ofertas') return 'Ofertas laborales';
    if (cleanUrl === '/dashboard/configuracion') return 'Configuracion';
    if (cleanUrl === '/dashboard/chatbot-config') return 'Chatbot IA';

    return 'Inicio';
  }
}
