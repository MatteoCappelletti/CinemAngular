import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { movieToMediaItem, personToMediaItem, tvToMediaItem } from '../models/media-item';
import { TmdbImagePipe } from '../pipes/tmdb-image-pipe';
import { TmdbService } from '../services/tmdb';
import { MediaGrid } from '../shared/media-grid/media-grid';
import { Spinner } from '../shared/spinner/spinner';

/**
 * Vetrina iniziale: un titolo in evidenza e una riga per ciascuna delle tre aree del sito.
 *
 * Ogni riga ha la sua `rxResource`, così le tre chiamate partono in parallelo
 * e una sezione lenta (o in errore) non blocca le altre.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, MediaGrid, Spinner, TmdbImagePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly tmdb = inject(TmdbService);

  protected readonly moviesResource = rxResource({
    stream: () => this.tmdb.getPopularMovies(),
  });

  protected readonly tvResource = rxResource({
    stream: () => this.tmdb.getPopularTvShows(),
  });

  protected readonly peopleResource = rxResource({
    stream: () => this.tmdb.getPopularPeople(),
  });

  protected readonly movies = computed(
    () => this.moviesResource.value()?.results.map(movieToMediaItem) ?? [],
  );

  protected readonly tvShows = computed(
    () => this.tvResource.value()?.results.map(tvToMediaItem) ?? [],
  );

  protected readonly people = computed(
    () => this.peopleResource.value()?.results.map(personToMediaItem) ?? [],
  );

  /** Primo film popolare che abbia un'immagine orizzontale utilizzabile come sfondo. */
  protected readonly hero = computed(
    () => this.moviesResource.value()?.results.find((movie) => movie.backdrop_path) ?? null,
  );
}
