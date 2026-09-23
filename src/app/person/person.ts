import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MediaItem, creditToMediaItem } from '../models/media-item';
import { CombinedCredit } from '../models/tmdb.models';
import { TmdbImagePipe } from '../pipes/tmdb-image-pipe';
import { TmdbService } from '../services/tmdb';
import { MediaGrid } from '../shared/media-grid/media-grid';
import { Spinner } from '../shared/spinner/spinner';

/** Quante voci di filmografia mostrare prima di chiedere "mostra tutto". */
const FILMOGRAPHY_PREVIEW = 18;

/**
 * Scheda persona: biografia, dati anagrafici e filmografia completa
 * (/person/{id} + /person/{id}/combined_credits).
 */
@Component({
  selector: 'app-person',
  imports: [DatePipe, MediaGrid, Spinner, TmdbImagePipe],
  templateUrl: './person.html',
  styleUrl: './person.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Person {
  private readonly tmdb = inject(TmdbService);

  /** Da `/persone/:id`. */
  readonly id = input.required<string>();

  protected readonly showAllCredits = signal(false);

  protected readonly personResource = rxResource({
    params: () => Number(this.id()),
    stream: ({ params: id }) => this.tmdb.getPersonDetails(id),
  });

  protected readonly creditsResource = rxResource({
    params: () => Number(this.id()),
    stream: ({ params: id }) => this.tmdb.getPersonCredits(id),
  });

  protected readonly biography = computed(
    () => this.personResource.value()?.biography?.trim() ?? '',
  );

  /** Età alla data odierna, o all'età alla morte se la persona è deceduta. */
  protected readonly age = computed(() => {
    const person = this.personResource.value();
    if (!person?.birthday) {
      return null;
    }
    const birth = new Date(person.birthday);
    const end = person.deathday ? new Date(person.deathday) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  });

  protected readonly genderLabel = computed(() => {
    switch (this.personResource.value()?.gender) {
      case 1:
        return 'Donna';
      case 2:
        return 'Uomo';
      case 3:
        return 'Non binaria';
      default:
        return null;
    }
  });

  /**
   * Filmografia unica: `cast` e `crew` possono contenere lo stesso titolo
   * (chi recita e dirige compare in entrambi), quindi si tiene una voce sola per titolo.
   */
  protected readonly filmography = computed<MediaItem[]>(() => {
    const credits = this.creditsResource.value();
    if (!credits) {
      return [];
    }

    const unique = new Map<string, CombinedCredit>();
    for (const credit of [...credits.cast, ...credits.crew]) {
      const key = `${credit.media_type}-${credit.id}`;
      if (!unique.has(key)) {
        unique.set(key, credit);
      }
    }

    return (
      [...unique.values()]
        // Dal più recente: è l'ordine in cui si cerca la filmografia di qualcuno.
        .sort((a, b) => {
          const dateA = a.release_date ?? a.first_air_date ?? '';
          const dateB = b.release_date ?? b.first_air_date ?? '';
          return dateB.localeCompare(dateA);
        })
        .map(creditToMediaItem)
    );
  });

  protected readonly visibleFilmography = computed(() =>
    this.showAllCredits() ? this.filmography() : this.filmography().slice(0, FILMOGRAPHY_PREVIEW),
  );

  protected readonly hasMoreCredits = computed(
    () => this.filmography().length > FILMOGRAPHY_PREVIEW,
  );
}
