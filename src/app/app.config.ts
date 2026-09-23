import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { tmdbAuthInterceptor } from './core/tmdb-auth-interceptor';

// Date e numeri formattati in italiano (pipe `date`, `number`, ...).
registerLocaleData(localeIt, 'it-IT');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Parametri e query string della rotta arrivano direttamente agli input dei componenti.
      withComponentInputBinding(),
      // Cambiando pagina si riparte dall'alto invece di restare a metà scroll.
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([tmdbAuthInterceptor])),
    { provide: LOCALE_ID, useValue: 'it-IT' },
  ],
};
