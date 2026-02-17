import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { authRefreshInterceptor } from './core/interceptors/auth-refresh.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        credentialsInterceptor,
        authRefreshInterceptor,
      ])
    ),
  ],
};
