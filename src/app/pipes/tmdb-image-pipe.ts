import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Misure disponibili su TMDB. `original` restituisce il file sorgente.
 * Sceglierne una vicina alla dimensione reale a schermo tiene leggere le pagine.
 */
export type TmdbImageSize =
  'w92' | 'w154' | 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

/**
 * Compone l'URL completo di un'immagine TMDB a partire dal percorso relativo
 * presente nelle risposte:  /abc123.jpg  →  https://image.tmdb.org/t/p/w500/abc123.jpg
 *
 * Uso nei template:  <img [src]="movie.poster_path | tmdbImage:'w500'">
 * Restituisce stringa vuota se il percorso manca, così il template può mostrare un segnaposto.
 */
@Pipe({ name: 'tmdbImage' })
export class TmdbImagePipe implements PipeTransform {
  transform(path: string | null | undefined, size: TmdbImageSize = 'w500'): string {
    if (!path) {
      return '';
    }
    return `${environment.imageBaseUrl}/${size}${path}`;
  }
}
