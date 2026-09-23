/**
 * Modelli delle risposte TMDB usate dal sito.
 * I campi mantengono lo snake_case dell'API per poter usare le risposte così come arrivano.
 */

/** Tipo di contenuto: le tre aree del sito. */
export type MediaType = 'movie' | 'tv' | 'person';

/** Risposta paginata, comune a popular / discover / search. */
export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** Genere (es. Azione, Commedia). Da /genre/movie/list e /genre/tv/list. */
export interface Genre {
  id: number;
  name: string;
}

/** Elemento di una lista di film (/movie/popular, /discover/movie). */
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  /** Percorso relativo, es. /abc123.jpg — va composto con la pipe tmdbImage. */
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

/** Elemento di una lista di serie TV (/tv/popular, /discover/tv). */
export interface TvShow {
  id: number;
  /** Le serie usano `name` al posto di `title`. */
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  /** Le serie usano `first_air_date` al posto di `release_date`. */
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

/** Persona in una lista (/person/popular, /search/multi). */
export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string | null;
  popularity: number;
}

/** Membro del cast (chi ha recitato). */
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

/** Membro della troupe (regista, sceneggiatore, ecc.). */
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

/** Blocco `credits` restituito con ?append_to_response=credits. */
export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

/** Scheda film: /movie/{id}?append_to_response=credits */
export interface MovieDetails extends Movie {
  tagline: string | null;
  /** Durata in minuti. */
  runtime: number | null;
  status: string;
  homepage: string | null;
  genres: Genre[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  budget: number;
  revenue: number;
  credits: Credits;
}

/** Scheda serie: /tv/{id}?append_to_response=credits */
export interface TvDetails extends TvShow {
  tagline: string | null;
  status: string;
  homepage: string | null;
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  last_air_date: string | null;
  created_by: { id: number; name: string; profile_path: string | null }[];
  credits: Credits;
}

/** Scheda persona: /person/{id} */
export interface PersonDetails extends Person {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  homepage: string | null;
  /** 1 = donna, 2 = uomo, 0/3 = non specificato secondo TMDB. */
  gender: number;
  also_known_as: string[];
}

/** Voce di filmografia: /person/{id}/combined_credits (film + serie insieme). */
export interface CombinedCredit {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  /** Presente se la persona ha recitato. */
  character?: string;
  /** Presente se la persona faceva parte della troupe. */
  job?: string;
}

export interface CombinedCredits {
  cast: CombinedCredit[];
  crew: CombinedCredit[];
}

/**
 * Risultato di /search/multi: film, serie e persone insieme.
 * `media_type` dice come interpretare l'oggetto.
 */
export type MultiSearchResult =
  | (Movie & { media_type: 'movie' })
  | (TvShow & { media_type: 'tv' })
  | (Person & { media_type: 'person' });
