export const environment = {
  production: false,

  /** Base URL delle API TMDB (v3). */
  tmdbApiUrl: 'https://api.themoviedb.org/3',

  /**
   * API Read Access Token (v4), da inviare come `Authorization: Bearer <token>`.
   * Vedi src/app/core/tmdb-auth-interceptor.ts
   */
  tmdbToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNWUzNTVmM2Q3OTNiNDE3YTM1M2IwN2Q5ZWQ1YzBlOCIsIm5iZiI6MTc5MDE0OTc0Mi4xMDQsInN1YiI6IjZhYjM4NDZlZDY4MTM3NDY0YjVlZWFmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.guPMaF9kaLBsY6y706X2JPgdqV4ztIAfObzQG9rdZ-k',

  /** Base URL delle immagini: si compone con `/{size}{path}`. */
  imageBaseUrl: 'https://image.tmdb.org/t/p',

  /** Lingua richiesta a TMDB per trame, titoli e biografie. */
  language: 'it-IT',
};
