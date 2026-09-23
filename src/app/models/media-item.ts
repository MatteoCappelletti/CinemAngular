import {
  CastMember,
  CombinedCredit,
  MediaType,
  Movie,
  MultiSearchResult,
  Person,
  TvShow,
} from './tmdb.models';

/**
 * Forma normalizzata usata da tutte le card del sito.
 *
 * TMDB descrive la stessa cosa con nomi diversi a seconda dell'area
 * (`title`/`name`, `release_date`/`first_air_date`, `poster_path`/`profile_path`):
 * convertire una volta sola qui evita di ripetere quei controlli in ogni template.
 */
export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  /** Percorso relativo dell'immagine (poster per film/serie, profilo per le persone). */
  imagePath: string | null;
  /** Data di uscita / prima messa in onda, in formato ISO. Vuota se sconosciuta. */
  date: string;
  /** Media voti 0-10. `null` per le persone, che non hanno un voto. */
  voteAverage: number | null;
  overview: string;
  /** Riga di contesto: personaggio interpretato, ruolo nella troupe, reparto. */
  subtitle?: string;
}

export function movieToMediaItem(movie: Movie): MediaItem {
  return {
    id: movie.id,
    mediaType: 'movie',
    title: movie.title,
    imagePath: movie.poster_path,
    date: movie.release_date ?? '',
    voteAverage: movie.vote_average,
    overview: movie.overview,
  };
}

export function tvToMediaItem(tv: TvShow): MediaItem {
  return {
    id: tv.id,
    mediaType: 'tv',
    title: tv.name,
    imagePath: tv.poster_path,
    date: tv.first_air_date ?? '',
    voteAverage: tv.vote_average,
    overview: tv.overview,
  };
}

export function personToMediaItem(person: Person): MediaItem {
  return {
    id: person.id,
    mediaType: 'person',
    title: person.name,
    imagePath: person.profile_path,
    date: '',
    voteAverage: null,
    overview: '',
    subtitle: person.known_for_department ?? undefined,
  };
}

/** Membro del cast di un film/serie → card cliccabile verso la scheda persona. */
export function castToMediaItem(member: CastMember): MediaItem {
  return {
    id: member.id,
    mediaType: 'person',
    title: member.name,
    imagePath: member.profile_path,
    date: '',
    voteAverage: null,
    overview: '',
    subtitle: member.character,
  };
}

/** Voce di filmografia → card verso la scheda film o serie. */
export function creditToMediaItem(credit: CombinedCredit): MediaItem {
  const isMovie = credit.media_type === 'movie';
  return {
    id: credit.id,
    mediaType: credit.media_type,
    title: (isMovie ? credit.title : credit.name) ?? 'Senza titolo',
    imagePath: credit.poster_path,
    date: (isMovie ? credit.release_date : credit.first_air_date) ?? '',
    voteAverage: credit.vote_average,
    overview: credit.overview,
    subtitle: credit.character || credit.job || undefined,
  };
}

/** Risultato di /search/multi → card del tipo corrispondente. */
export function searchResultToMediaItem(result: MultiSearchResult): MediaItem {
  switch (result.media_type) {
    case 'movie':
      return movieToMediaItem(result);
    case 'tv':
      return tvToMediaItem(result);
    case 'person':
      return personToMediaItem(result);
  }
}

/** Rotta della scheda di dettaglio corrispondente all'elemento. */
export function detailRoute(item: Pick<MediaItem, 'id' | 'mediaType'>): string[] {
  switch (item.mediaType) {
    case 'movie':
      return ['/film', String(item.id)];
    case 'tv':
      return ['/serie', String(item.id)];
    case 'person':
      return ['/persone', String(item.id)];
  }
}
