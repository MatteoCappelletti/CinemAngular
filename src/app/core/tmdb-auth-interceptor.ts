import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Aggiunge a ogni chiamata verso TMDB l'header `Authorization: Bearer <read access token>`
 * richiesto dalla v4 delle API, più la lingua di default.
 *
 * Tenere il token qui invece che nel service evita di ripeterlo a ogni richiesta
 * e lascia le chiamate in TmdbService leggibili come semplici URL.
 */
export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Le richieste verso altri domini (es. asset locali) non vanno toccate.
  if (!req.url.startsWith(environment.tmdbApiUrl)) {
    return next(req);
  }

  const authorized = req.clone({
    setHeaders: {
      Authorization: `Bearer ${environment.tmdbToken}`,
      Accept: 'application/json',
    },
    // `setParams` non sovrascrive un `language` già impostato dal chiamante.
    setParams: req.params.has('language') ? {} : { language: environment.language },
  });

  return next(authorized);
};
