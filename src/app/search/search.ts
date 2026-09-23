import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { searchResultToMediaItem } from '../models/media-item';
import { TmdbService } from '../services/tmdb';
import { MediaGrid } from '../shared/media-grid/media-grid';
import { Spinner } from '../shared/spinner/spinner';

/** Attesa prima di interrogare TMDB: evita una chiamata per ogni tasto premuto. */
const DEBOUNCE_MS = 300;

/**
 * Ricerca unica su film, serie e persone (/search/multi), con i risultati
 * separati per categoria.
 *
 * La query iniziale arriva dall'URL (?q=...), così una ricerca è condivisibile;
 * poi il campo di testo la aggiorna con un debounce.
 */
@Component({
  selector: 'app-search',
  imports: [FormsModule, MediaGrid, Spinner],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  private readonly tmdb = inject(TmdbService);

  /** Da `?q=` — anche quando la ricerca parte dalla barra nell'header. */
  readonly q = input('');

  /** Testo nel campo: parte dall'URL, poi lo guida l'utente. */
  protected readonly query = linkedSignal(() => this.q());

  private readonly debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(DEBOUNCE_MS), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly activeQuery = computed(() => this.debouncedQuery().trim());

  protected readonly resultsResource = rxResource({
    // `undefined` = nessuna richiesta: con il campo vuoto non c'è niente da cercare.
    params: () => this.activeQuery() || undefined,
    stream: ({ params: query }) => this.tmdb.searchMulti(query),
  });

  private readonly results = computed(
    () => this.resultsResource.value()?.results.map(searchResultToMediaItem) ?? [],
  );

  protected readonly movies = computed(() =>
    this.results().filter((item) => item.mediaType === 'movie'),
  );

  protected readonly tvShows = computed(() =>
    this.results().filter((item) => item.mediaType === 'tv'),
  );

  protected readonly people = computed(() =>
    this.results().filter((item) => item.mediaType === 'person'),
  );

  protected readonly totalResults = computed(() => this.results().length);
}
