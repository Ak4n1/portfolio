import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    // Colores principales
    primary: string;
    secondary: string;
    accent: string;

    // Backgrounds
    backgroundDark: string;
    backgroundLight: string;
    backgroundCard: string;
    backgroundHero: string;
    backgroundSection: string;

    // Textos
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;

    // Títulos y headings
    titlePrimary: string;
    titleSecondary: string;
    sectionTitle: string;

    // Bordes y sombras
    borderColor: string;
    borderHover: string;
    shadowNeon: string;
    shadowCard: string;

    // Estados
    success: string;
    warning: string;
    error: string;
    info: string;

    // Elementos específicos
    iconColor: string;              // Color para iconos de Simple Icons
    techItemBg: string;            // Fondo de los tech items
    linkColor: string;             // Color de enlaces
    linkHover: string;             // Color de enlaces en hover
    buttonPrimary: string;         // Fondo de botones primarios
    buttonSecondary: string;       // Fondo de botones secundarios

    // Progress bars y elementos de UI
    progressBg: string;            // Fondo de barras de progreso
    progressFill: string;          // Relleno de barras de progreso

    // Overlays y modales
    overlayBg: string;             // Fondo de overlays
    modalBg: string;               // Fondo de modales
  };
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  dark: {
    name: 'dark',
    displayName: 'Modo Oscuro',
    colors: {
      // Colores principales
      primary: 'rgb(0, 255, 195)',        // Verde cian brillante
      secondary: 'rgb(255, 0, 255)',      // Magenta brillante
      accent: 'rgb(0, 255, 195)',         // Acento - mismo que primary

      // Backgrounds
      backgroundDark: 'rgb(15, 15, 15)',  // Negro profundo
      backgroundLight: 'rgb(26, 26, 26)', // Gris muy oscuro
      backgroundCard: 'rgba(255, 255, 255, 0.05)', // Fondo de tarjetas
      backgroundHero: 'linear-gradient(135deg, rgb(15, 15, 15) 0%, rgb(26, 26, 26) 100%)', // Fondo hero
      backgroundSection: 'rgb(10, 10, 10)', // Fondo de secciones alternas

      // Textos
      textPrimary: 'rgb(255, 255, 255)',  // Blanco puro
      textSecondary: 'rgb(204, 204, 204)', // Gris claro
      textMuted: 'rgb(136, 136, 136)',    // Gris medio
      textAccent: 'rgb(0, 255, 195)',     // Texto de acento

      // Títulos y headings
      titlePrimary: 'rgb(0, 255, 195)',   // Títulos principales
      titleSecondary: 'rgb(255, 255, 255)', // Títulos secundarios
      sectionTitle: 'rgb(0, 255, 195)',   // Títulos de sección

      // Bordes y sombras
      borderColor: 'rgba(255, 255, 255, 0.2)', // Verde cian transparente
      borderHover: 'rgba(0, 255, 195, 0.5)', // Borde en hover
      shadowNeon: '0 0 20px rgba(0, 255, 195, 0.3)', // Sombra verde cian
      shadowCard: '0 10px 30px rgba(0, 255, 195, 0.1)', // Sombra de tarjetas

      // Estados
      success: 'rgb(34, 197, 94)',        // Verde éxito
      warning: 'rgb(251, 191, 36)',       // Amarillo advertencia
      error: 'rgb(239, 68, 68)',          // Rojo error
      info: 'rgb(59, 130, 246)',          // Azul información

      // Elementos específicos
      iconColor: 'white',                 // Iconos blancos para fondo oscuro
      techItemBg: 'rgba(26, 26, 26, 0.8)', // Fondo de tech items
      linkColor: 'rgb(0, 255, 195)',      // Color de enlaces
      linkHover: 'rgb(0, 255, 195)',      // Color de enlaces en hover
      buttonPrimary: 'rgb(0, 255, 195)',  // Botones primarios
      buttonSecondary: 'rgba(255, 255, 255, 0.05)', // Botones secundarios

      // Progress bars y elementos de UI
      progressBg: 'rgba(255, 255, 255, 0.1)', // Fondo de progress bars
      progressFill: 'linear-gradient(45deg, rgb(0, 255, 195), rgb(0, 212, 170))', // Relleno de progress

      // Overlays y modales
      overlayBg: 'rgba(0, 0, 0, 0.9)',    // Fondo de overlays
      modalBg: 'rgba(255, 255, 255, 0.05)' // Fondo de modales
    }
  },
  light: {
    name: 'light',
    displayName: 'Modo Claro',
    colors: {
      // Colores principales
      primary: 'rgb(0, 184, 148)',        // Verde esmeralda
      secondary: 'rgb(108, 92, 231)',     // Púrpura azulado
      accent: 'rgb(0, 184, 148)',         // Acento - mismo que primary

      // Backgrounds
      backgroundDark: 'rgb(240, 242, 245)', // Gris muy claro suave (antes blanco puro)
      backgroundLight: 'rgb(235, 238, 242)', // Gris claro suave
      backgroundCard: 'rgba(0, 0, 0, 0.05)', // Fondo de tarjetas
      backgroundHero: 'linear-gradient(135deg, rgb(240, 242, 245) 0%, rgb(235, 238, 242) 100%)', // Fondo hero
      backgroundSection: 'rgb(245, 247, 250)', // Fondo de secciones alternas (gris muy claro)

      // Textos
      textPrimary: 'rgb(45, 52, 54)',     // Casi negro
      textSecondary: 'rgb(99, 110, 114)', // Gris oscuro
      textMuted: 'rgb(148, 163, 184)',    // Gris claro
      textAccent: 'rgb(0, 184, 148)',     // Texto de acento

      // Títulos y headings
      titlePrimary: 'rgb(15, 15, 15)',   // Títulos principales
      titleSecondary: 'rgb(45, 52, 54)',  // Títulos secundarios
      sectionTitle: 'rgb(0, 0, 0)',   // Títulos de sección

      // Bordes y sombras
      borderColor: 'rgba(34, 36, 35, 0.2)', // Verde esmeralda transparente
      borderHover: 'rgba(0, 184, 148, 0.5)', // Borde en hover
      shadowNeon: '0 0 20px rgba(0, 184, 148, 0.3)', // Sombra verde esmeralda
      shadowCard: '0 10px 30px rgba(0, 184, 148, 0.1)', // Sombra de tarjetas

      // Estados
      success: 'rgb(34, 197, 94)',        // Verde éxito
      warning: 'rgb(245, 158, 11)',       // Amarillo advertencia
      error: 'rgb(239, 68, 68)',          // Rojo error
      info: 'rgb(59, 130, 246)',          // Azul información

      // Elementos específicos
      iconColor: 'rgb(45, 52, 54)',       // Iconos oscuros para fondo claro
      techItemBg: 'rgba(0, 0, 0, 0.05)',  // Fondo de tech items
      linkColor: 'rgb(0, 184, 148)',      // Color de enlaces
      linkHover: 'rgb(0, 150, 120)',      // Color de enlaces en hover
      buttonPrimary: 'rgb(0, 184, 148)',  // Botones primarios
      buttonSecondary: 'rgba(0, 0, 0, 0.05)', // Botones secundarios

      // Progress bars y elementos de UI
      progressBg: 'rgba(0, 0, 0, 0.1)',   // Fondo de progress bars
      progressFill: 'linear-gradient(45deg, rgb(0, 184, 148), rgb(0, 150, 120))', // Relleno de progress

      // Overlays y modales
      overlayBg: 'rgba(0, 0, 0, 0.5)',    // Fondo de overlays
      modalBg: 'rgba(255, 255, 255, 0.95)' // Fondo de modales
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private currentThemeSubject = new BehaviorSubject<string>('dark');
  public currentTheme$ = this.currentThemeSubject.asObservable();
  private activeTimeouts: Set<number> = new Set();

  constructor() {
    // Cargar tema guardado o usar el tema del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    this.setTheme(initialTheme);
  }

  getCurrentTheme(): string {
    return this.currentThemeSubject.value;
  }

  getCurrentThemeConfig(): ThemeConfig {
    return THEME_CONFIGS[this.getCurrentTheme()];
  }

  setTheme(themeName: string, withDelay: boolean = false): void {
    if (!THEME_CONFIGS[themeName]) {
      console.warn(`Theme ${themeName} not found, using dark theme`);
      themeName = 'dark';
    }

    const theme = THEME_CONFIGS[themeName];
    const root = document.documentElement;

    // Función para aplicar el tema
    const applyTheme = () => {
      // Limpiar variables CSS anteriores para evitar acumulación
      this.clearPreviousThemeVariables();

      // Aplicar variables CSS
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
      });

      // Actualizar data-theme para CSS adicional
      document.body.setAttribute('data-theme', themeName);

      // Guardar en localStorage
      localStorage.setItem('theme', themeName);

      // Notificar cambio
      this.currentThemeSubject.next(themeName);
    };

    if (withDelay) {
      // Limpiar timeouts anteriores para evitar acumulación
      this.clearActiveTimeouts();

      // Añadir una clase temporal para indicar cambio de tema
      document.body.classList.add('theme-changing');

      // Aplicar el tema inmediatamente sin delays
      applyTheme();

      // Remover la clase después de la transición
      const timeout = window.setTimeout(() => {
        document.body.classList.remove('theme-changing');
        this.activeTimeouts.delete(timeout);
      }, 1000); // Solo 1s para la transición CSS

      this.activeTimeouts.add(timeout);
    } else {
      applyTheme();
    }
  }

  toggleTheme(withDelay: boolean = true): void {
    const current = this.getCurrentTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme, withDelay);
  }

  // Método para agregar nuevos temas fácilmente
  static addCustomTheme(name: string, config: ThemeConfig): void {
    THEME_CONFIGS[name] = config;
  }

  getAvailableThemes(): ThemeConfig[] {
    return Object.values(THEME_CONFIGS);
  }

  // Helpers para obtener colores específicos
  getPrimaryColor(): string {
    return this.getCurrentThemeConfig().colors.primary;
  }

  getSecondaryColor(): string {
    return this.getCurrentThemeConfig().colors.secondary;
  }

  getBackgroundColor(): string {
    return this.getCurrentThemeConfig().colors.backgroundDark;
  }

  // Método para configurar la velocidad de transición
  setTransitionDuration(duration: string = '2.5s'): void {
    document.documentElement.style.setProperty('--theme-transition-duration', duration);
  }

  // Método para configurar el delay de transición
  setTransitionDelay(delay: string = '1.5s'): void {
    document.documentElement.style.setProperty('--theme-transition-delay', delay);
  }

  // Método para configurar el tipo de easing
  setTransitionTiming(timing: string = 'cubic-bezier(0.4, 0, 0.2, 1)'): void {
    document.documentElement.style.setProperty('--theme-transition-timing', timing);
  }

  // Método privado para limpiar timeouts activos
  private clearActiveTimeouts(): void {
    this.activeTimeouts.forEach(timeout => {
      window.clearTimeout(timeout);
    });
    this.activeTimeouts.clear();
  }

  // Método privado para limpiar variables CSS anteriores
  private clearPreviousThemeVariables(): void {
    const root = document.documentElement;
    const allThemeKeys = new Set<string>();

    // Recopilar todas las claves de todos los temas
    Object.values(THEME_CONFIGS).forEach(theme => {
      Object.keys(theme.colors).forEach(key => {
        allThemeKeys.add(key);
      });
    });

    // Remover todas las variables CSS de temas
    allThemeKeys.forEach(key => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.removeProperty(cssVarName);
    });
  }

  // Método para limpiar recursos al destruir el servicio
  ngOnDestroy(): void {
    this.clearActiveTimeouts();
    this.currentThemeSubject.complete();
  }

  // Método para debugging: obtener información sobre el estado del servicio
  getDebugInfo(): { activeTimeouts: number; currentTheme: string; memoryUsage?: any } {
    const info: any = {
      activeTimeouts: this.activeTimeouts.size,
      currentTheme: this.getCurrentTheme()
    };

    // Información de memoria (solo disponible en algunos navegadores)
    if ('memory' in performance) {
      info.memoryUsage = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }

    return info;
  }

  // Método para aplicar configuración de transición personalizada
  configureTransition(duration: string = '2.5s', delay: string = '1.5s', timing: string = 'cubic-bezier(0.4, 0, 0.2, 1)'): void {
    this.setTransitionDuration(duration);
    this.setTransitionDelay(delay);
    this.setTransitionTiming(timing);
  }

  /*
   * SINCRONIZACIÓN CON HERO-CANVAS:
   * - Hero-canvas: inicia inmediatamente, dura 1.5s
   * - UI Elements: esperan 1.5s (delay), luego transicionan por 2.5s
   * - Efecto: Hero-canvas cambia primero, luego la UI le sigue
   * - Duración total: 4s (1.5s delay + 2.5s duration)
   * 
   * EJEMPLOS DE USO:
   * 
   * // Cambio de tema básico (sin delay)
   * themeService.setTheme('light');
   * 
   * // Cambio de tema con animación suave (con delay) - RECOMENDADO
   * themeService.setTheme('light', true);
   * 
   * // Toggle con animación (por defecto) - sincronizado con hero-canvas
   * themeService.toggleTheme();
   * 
   * // Toggle sin animación
   * themeService.toggleTheme(false);
   * 
   * // Configurar transición personalizada (duration, delay, timing)
   * themeService.configureTransition('1s', '0.5s', 'ease-in-out');
   * 
   * // Solo cambiar el delay
   * themeService.setTransitionDelay('2s');
   * 
   * // Transición sin delay
   * themeService.configureTransition('1.5s', '0s', 'ease');
   */
}
