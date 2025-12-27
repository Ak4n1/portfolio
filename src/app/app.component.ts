import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { PreloaderComponent } from './shared/preloader/preloader.component';
import { ThemeService } from './core/services/theme.service';
import { AboutComponent } from "./pages/about/about.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  title = 'portafolio';

  ngOnInit() {
    // Asegurar que el servicio de temas se inicialice
    console.log('App initialized, current theme:', this.themeService.getCurrentTheme());
  }

  onPreloaderComplete() {
    console.log('Preloader completado');
    // Señal global para componentes que quieran esperar al preloader
    (window as any).__preloaderCompleted = true;
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }
}
