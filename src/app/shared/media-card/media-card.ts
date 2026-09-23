import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaItem, detailRoute } from '../../models/media-item';
import { TmdbImagePipe } from '../../pipes/tmdb-image-pipe';

/**
 * Card di anteprima usata ovunque: liste, home, cast, filmografie, risultati di ricerca.
 * Riceve un MediaItem già normalizzato, quindi non deve sapere se dietro c'è
 * un film, una serie o una persona: cambia solo il link di destinazione.
 */
@Component({
  selector: 'app-media-card',
  imports: [RouterLink, TmdbImagePipe],
  templateUrl: './media-card.html',
  styleUrl: './media-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCard {
  readonly item = input.required<MediaItem>();

  protected readonly link = computed(() => detailRoute(this.item()));

  /** Solo l'anno: la data completa in una card è rumore. */
  protected readonly year = computed(() => this.item().date?.slice(0, 4) || '');

  /** Voto arrotondato a una cifra decimale; `null` quando non ha senso (persone). */
  protected readonly rating = computed(() => {
    const vote = this.item().voteAverage;
    return vote && vote > 0 ? vote.toFixed(1) : null;
  });
}
