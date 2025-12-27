import { ThemeService, ThemeConfig } from './theme.service';

// Aquí puedes agregar fácilmente nuevos temas personalizados
// Ejemplo de cómo agregar un tema personalizado:

/*
// Tema Azul Océano
const oceanTheme: ThemeConfig = {
  name: 'ocean',
  displayName: 'Océano',
  colors: {
    primary: '#0099ff',
    secondary: '#00d4ff',
    backgroundDark: '#0a1929',
    backgroundLight: '#132f4c',
    textPrimary: '#ffffff',
    textSecondary: '#b3d9ff',
    textMuted: '#7bb3f0',
    borderColor: 'rgba(0, 153, 255, 0.2)',
    shadowNeon: '0 0 20px rgba(0, 153, 255, 0.3)'
  }
};

// Tema Púrpura Neón
const neonPurpleTheme: ThemeConfig = {
  name: 'neon-purple',
  displayName: 'Púrpura Neón',
  colors: {
    primary: '#b794f6',
    secondary: '#ed64a6',
    backgroundDark: '#1a1625',
    backgroundLight: '#2d2438',
    textPrimary: '#ffffff',
    textSecondary: '#d6bcfa',
    textMuted: '#a78bfa',
    borderColor: 'rgba(183, 148, 246, 0.2)',
    shadowNeon: '0 0 20px rgba(183, 148, 246, 0.3)'
  }
};

// Registrar los temas
ThemeService.addCustomTheme('ocean', oceanTheme);
ThemeService.addCustomTheme('neon-purple', neonPurpleTheme);
*/

// Para agregar un nuevo tema:
// 1. Crea un objeto ThemeConfig con todos los colores
// 2. Usa ThemeService.addCustomTheme(nombre, config)
// 3. El tema estará disponible automáticamente

export function initializeCustomThemes() {
  // Aquí puedes inicializar temas personalizados si los tienes
  console.log('Custom themes initialized');
}
