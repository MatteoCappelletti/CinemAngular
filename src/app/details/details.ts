import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { castToMediaItem } from '../models/media-item';
import { MovieDetails, TvDetails } from '../models/tmdb.models';
import { TmdbImagePipe } from '../pipes/tmdb-image-pipe';
import { TmdbService } from '../services/tmdb';
import { MediaGrid } from '../shared/media-grid/media-grid';
import { Spinner } from '../shared/spinner/spinner';

/** Reparti mostrati nella troupe, nell'ordine in cui interessano allo spettatore. */
const KEY_JOBS = [
  'Director',
  'Creator',
  'Screenplay',
  'Writer',
  'Story',
  'Producer',
  'Executive Producer',
  'Director of Photography',
  'Original Music Composer',
];

/** Traduzioni dei ruoli di troupe più ricorrenti: TMDB li restituisce sempre in inglese. */
const JOB_LABELS: Record<string, string> = {
  Director: 'Regia',
  Creator: 'Ideatore',
  Screenplay: 'Sceneggiatura',
  Writer: 'Sceneggiatura',
  Story: 'Soggetto',
  Producer: 'Produzione',
  'Executive Producer': 'Produzione esecutiva',
  'Director of Photography': 'Fotografia',
  'Original Music Composer': 'Musiche',
};

/** Cosa identifica la scheda da caricare. */
interface DetailsParams {
  id: number;
  mediaType: 'movie' | 'tv';
}

/**
 * Scheda di dettaglio di un film o di una serie TV.
 *
 * I dati arrivano da una sola chiamata grazie a `append_to_response=credits`,
 * che allega cast e troupe alla risposta principale.
 */
@Component({
  selector: 'app-details',
  imports: [MediaGrid, Spinner, TmdbImagePipe],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  private readonly tmdb = inject(TmdbService);

  /** Da `/film/:id` o `/serie/:id`. */
  readonly id = input.required<string>();
  /** Da `data: { mediaType }` della rotta. */
  readonly mediaType = input.required<'movie' | 'tv'>();

  protected readonly isMovie = computed(() => this.mediaType() === 'movie');

  protected readonly detailsResource = rxResource<MovieDetails | TvDetails, DetailsParams>({
    params: () => ({ id: Number(this.id()), mediaType: this.mediaType() }),
    stream: ({ params }) =>
      params.mediaType === 'movie'
        ? this.tmdb.getMovieDetails(params.id)
        : this.tmdb.getTvDetails(params.id),
  });

  protected readonly movie = computed(() =>
    this.isMovie() ? (this.detailsResource.value() as MovieDetails | undefined) : undefined,
  );

  protected readonly tv = computed(() =>
    this.isMovie() ? undefined : (this.detailsResource.value() as TvDetails | undefined),
  );

  protected readonly title = computed(() => this.movie()?.title ?? this.tv()?.name ?? '');

  protected readonly year = computed(() => {
    const date = this.movie()?.release_date ?? this.tv()?.first_air_date ?? '';
    return date.slice(0, 4);
  });

  protected readonly rating = computed(() => {
    const vote = this.detailsResource.value()?.vote_average ?? 0;
    return vote > 0 ? vote.toFixed(1) : null;
  });

  /** Durata del film, o durata media di un episodio per le serie. */
  protected readonly runtime = computed(() => {
    const movieRuntime = this.movie()?.runtime;
    if (movieRuntime) {
      const hours = Math.floor(movieRuntime / 60);
      const minutes = movieRuntime % 60;
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    }
    const episodeRuntime = this.tv()?.episode_run_time?.[0];
    return episodeRuntime ? `${episodeRuntime}min per episodio` : null;
  });

  /** Riga "3 stagioni · 28 episodi", solo per le serie. */
  protected readonly seasons = computed(() => {
    const tv = this.tv();
    if (!tv) {
      return null;
    }
    const seasons = `${tv.number_of_seasons} ${tv.number_of_seasons === 1 ? 'stagione' : 'stagioni'}`;
    const episodes = `${tv.number_of_episodes} ${tv.number_of_episodes === 1 ? 'episodio' : 'episodi'}`;
    return `${seasons} · ${episodes}`;
  });

  protected readonly cast = computed(
    () => this.detailsResource.value()?.credits?.cast.slice(0, 18).map(castToMediaItem) ?? [],
  );

  /**
   * Troupe raggruppata per ruolo: TMDB restituisce una riga per persona e per incarico,
   * quindi la stessa persona può comparire più volte.
   */
  protected readonly crew = computed(() => {
    const details = this.detailsResource.value();
    if (!details) {
      return [];
    }

    // Le serie non hanno un "Director" unico: i creatori stanno in un campo a parte.
    const creators = (this.tv()?.created_by ?? []).map((person) => ({
      job: 'Creator',
      name: person.name,
      id: person.id,
    }));

    const fromCredits = details.credits.crew
      .filter((member) => KEY_JOBS.includes(member.job))
      .map((member) => ({ job: member.job, name: member.name, id: member.id }));

    const grouped = new Map<string, string[]>();
    for (const member of [...creators, ...fromCredits]) {
      const label = JOB_LABELS[member.job] ?? member.job;
      const names = grouped.get(label) ?? [];
      if (!names.includes(member.name)) {
        names.push(member.name);
      }
      grouped.set(label, names);
    }

    return [...grouped].map(([job, names]) => ({ job, names: names.join(', ') }));
  });
}
