import { Routes } from '@angular/router';

/**
 * Le tre aree della specifica.
 * Film e serie condividono gli stessi due componenti: cambia solo `mediaType`,
 * che grazie a `withComponentInputBinding()` arriva come input al componente.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'CinemAngular',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },

  // ----------------------------------------------------------------- Film
  {
    path: 'film',
    title: 'Film — CinemAngular',
    data: { mediaType: 'movie' },
    loadComponent: () => import('./media-list/media-list').then((m) => m.MediaList),
  },
  {
    path: 'film/:id',
    data: { mediaType: 'movie' },
    loadComponent: () => import('./details/details').then((m) => m.Details),
  },

  // ------------------------------------------------------------- Serie TV
  {
    path: 'serie',
    title: 'Serie TV — CinemAngular',
    data: { mediaType: 'tv' },
    loadComponent: () => import('./media-list/media-list').then((m) => m.MediaList),
  },
  {
    path: 'serie/:id',
    data: { mediaType: 'tv' },
    loadComponent: () => import('./details/details').then((m) => m.Details),
  },

  // -------------------------------------------------------------- Persone
  {
    path: 'persone',
    title: 'Persone — CinemAngular',
    loadComponent: () => import('./people/people').then((m) => m.People),
  },
  {
    path: 'persone/:id',
    loadComponent: () => import('./person/person').then((m) => m.Person),
  },

  // -------------------------------------------------------------- Ricerca
  {
    path: 'ricerca',
    title: 'Ricerca — CinemAngular',
    loadComponent: () => import('./search/search').then((m) => m.Search),
  },

  {
    path: '**',
    title: 'Pagina non trovata — CinemAngular',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
