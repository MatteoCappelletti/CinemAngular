import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { movieToMediaItem, tvToMediaItem } from '../models/media-item';
import { Movie, TmdbPage, TvShow } from '../models/tmdb.models';
import { TmdbService } from '../services/tmdb';
import { MediaGrid } from '../shared/media-grid/media-grid';
import { Spinner } from '../shared/spinner/spinner';

/** TMDB non serve oltre la pagina 500, anche quando `total_pages` è più alto. */
const MAX_PAGE = 500;

/** Cosa determina il contenuto dell'elenco: al variare di uno di questi la lista si ricarica. */
interface ListParams {
  mediaType: 'movie' | 'tv';
  genreId: number | null;
  page: number;
}

/**
 * Elenco di film o serie TV, filtrabile per genere.
 *
 * È lo stesso componente per entrambe le sezioni: `mediaType` arriva dai `data`
 * della rotta, genere e pagina dalla query string — così un elenco filtrato
 * resta condivisibile e sopravvive al ricaricamento della pagina.
 */
@Component({
  selector: 'app-media-list',
  imports: [MediaGrid, Spinner],
  templateUrl: './media-list.html',
  styleUrl: './media-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaList {
  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Da `data: { mediaType }` della rotta. */
  readonly mediaType = input.required<'movie' | 'tv'>();
  /** Da `?genere=` — id del genere TMDB, assente se nessun filtro è attivo. */
  readonly genere = input<string>();
  /** Da `?pagina=`. */
  readonly pagina = input<string>();

  protected readonly isMovie = computed(() => this.mediaType() === 'movie');

  protected readonly selectedGenreId = computed(() => {
    const raw = Number(this.genere());
    return Number.isInteger(raw) && raw > 0 ? raw : null;
  });

  protected readonly page = computed(() => {
    const raw = Number(this.pagina());
    return Number.isInteger(raw) && raw > 0 ? Math.min(raw, MAX_PAGE) : 1;
  });

  protected readonly genresResource = rxResource({
    params: () => this.mediaType(),
    stream: ({ params: mediaType }) =>
      mediaType === 'movie' ? this.tmdb.getMovieGenres() : this.tmdb.getTvGenres(),
  });

  protected readonly listResource = rxResource<TmdbPage<Movie | TvShow>, ListParams>({
    params: () => ({
      mediaType: this.mediaType(),
      genreId: this.selectedGenreId(),
      page: this.page(),
    }),
    stream: ({ params }) => {
      const { mediaType, genreId, page } = params;
      if (mediaType === 'movie') {
        return genreId === null
          ? this.tmdb.getPopularMovies(page)
          : this.tmdb.discoverMovies(genreId, page);
      }
      return genreId === null
        ? this.tmdb.getPopularTvShows(page)
        : this.tmdb.discoverTvShows(genreId, page);
    },
  });

  protected readonly genres = computed(() => this.genresResource.value() ?? []);

  protected readonly items = computed(() => {
    const value = this.listResource.value();
    if (!value) {
      return [];
    }
    return this.isMovie()
      ? (value.results as Movie[]).map(movieToMediaItem)
      : (value.results as TvShow[]).map(tvToMediaItem);
  });

  protected readonly totalPages = computed(() =>
    Math.min(this.listResource.value()?.total_pages ?? 1, MAX_PAGE),
  );

  protected readonly title = computed(() => (this.isMovie() ? 'Film' : 'Serie TV'));

  protected readonly selectedGenreName = computed(
    () => this.genres().find((genre) => genre.id === this.selectedGenreId())?.name ?? null,
  );

  /** Cambiando filtro si riparte dalla prima pagina: la pagina 7 di un altro genere non ha senso. */
  protected onGenreChange(value: string): void {
    this.navigate(value === '' ? null : Number(value), 1);
  }

  protected goToPage(page: number): void {
    this.navigate(this.selectedGenreId(), page);
  }

  private navigate(genreId: number | null, page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        genere: genreId ?? null,
        pagina: page > 1 ? page : null,
      },
    });
  }
}
