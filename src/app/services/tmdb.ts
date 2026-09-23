import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CombinedCredits,
  Genre,
  Movie,
  MovieDetails,
  MultiSearchResult,
  Person,
  PersonDetails,
  TmdbPage,
  TvDetails,
  TvShow,
} from '../models/tmdb.models';

/**
 * Unico punto di accesso alle API TMDB.
 *
 * Il token e la lingua vengono aggiunti dall'interceptor (core/tmdb-auth-interceptor.ts),
 * quindi qui restano solo gli endpoint documentati nella specifica.
 */
@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbApiUrl;

  // ---------------------------------------------------------------- Film

  /** GET /movie/popular */
  getPopularMovies(page = 1): Observable<TmdbPage<Movie>> {
    return this.http.get<TmdbPage<Movie>>(`${this.baseUrl}/movie/popular`, {
      params: new HttpParams().set('page', page),
    });
  }

  /** GET /discover/movie?with_genres={id} — se il genere è null torna comunque i film più popolari. */
  discoverMovies(genreId: number | null, page = 1): Observable<TmdbPage<Movie>> {
    let params = new HttpParams().set('page', page).set('sort_by', 'popularity.desc');
    if (genreId !== null) {
      params = params.set('with_genres', genreId);
    }
    return this.http.get<TmdbPage<Movie>>(`${this.baseUrl}/discover/movie`, { params });
  }

  /** GET /genre/movie/list */
  getMovieGenres(): Observable<Genre[]> {
    return this.http
      .get<{ genres: Genre[] }>(`${this.baseUrl}/genre/movie/list`)
      .pipe(map((response) => response.genres));
  }

  /** GET /movie/{id}?append_to_response=credits — scheda completa con cast e troupe. */
  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits'),
    });
  }

  // ------------------------------------------------------------ Serie TV

  /** GET /tv/popular */
  getPopularTvShows(page = 1): Observable<TmdbPage<TvShow>> {
    return this.http.get<TmdbPage<TvShow>>(`${this.baseUrl}/tv/popular`, {
      params: new HttpParams().set('page', page),
    });
  }

  /** GET /discover/tv?with_genres={id} */
  discoverTvShows(genreId: number | null, page = 1): Observable<TmdbPage<TvShow>> {
    let params = new HttpParams().set('page', page).set('sort_by', 'popularity.desc');
    if (genreId !== null) {
      params = params.set('with_genres', genreId);
    }
    return this.http.get<TmdbPage<TvShow>>(`${this.baseUrl}/discover/tv`, { params });
  }

  /** GET /genre/tv/list */
  getTvGenres(): Observable<Genre[]> {
    return this.http
      .get<{ genres: Genre[] }>(`${this.baseUrl}/genre/tv/list`)
      .pipe(map((response) => response.genres));
  }

  /** GET /tv/{id}?append_to_response=credits */
  getTvDetails(id: number): Observable<TvDetails> {
    return this.http.get<TvDetails>(`${this.baseUrl}/tv/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits'),
    });
  }

  // ------------------------------------------------------------- Persone

  /** GET /person/popular */
  getPopularPeople(page = 1): Observable<TmdbPage<Person>> {
    return this.http.get<TmdbPage<Person>>(`${this.baseUrl}/person/popular`, {
      params: new HttpParams().set('page', page),
    });
  }

  /** GET /person/{id} — biografia e dati anagrafici. */
  getPersonDetails(id: number): Observable<PersonDetails> {
    return this.http.get<PersonDetails>(`${this.baseUrl}/person/${id}`);
  }

  /** GET /person/{id}/combined_credits — filmografia: film e serie insieme. */
  getPersonCredits(id: number): Observable<CombinedCredits> {
    return this.http.get<CombinedCredits>(`${this.baseUrl}/person/${id}/combined_credits`);
  }

  // ------------------------------------------------------------- Ricerca

  /** GET /search/multi?query=... — film, serie e persone in un'unica risposta. */
  searchMulti(query: string, page = 1): Observable<TmdbPage<MultiSearchResult>> {
    return this.http.get<TmdbPage<MultiSearchResult>>(`${this.baseUrl}/search/multi`, {
      params: new HttpParams().set('query', query).set('page', page).set('include_adult', false),
    });
  }
}
