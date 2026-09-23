import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { personToMediaItem } from '../models/media-item';
import { TmdbService } from '../services/tmdb';
import { MediaGrid } from '../shared/media-grid/media-grid';
import { Spinner } from '../shared/spinner/spinner';

const MAX_PAGE = 500;

/** Elenco delle persone più popolari: punto d'ingresso alla sezione Persone. */
@Component({
  selector: 'app-people',
  imports: [MediaGrid, Spinner],
  templateUrl: './people.html',
  styleUrl: './people.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class People {
  private readonly tmdb = inject(TmdbService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly pagina = input<string>();

  protected readonly page = computed(() => {
    const raw = Number(this.pagina());
    return Number.isInteger(raw) && raw > 0 ? Math.min(raw, MAX_PAGE) : 1;
  });

  protected readonly peopleResource = rxResource({
    params: () => this.page(),
    stream: ({ params: page }) => this.tmdb.getPopularPeople(page),
  });

  protected readonly people = computed(
    () => this.peopleResource.value()?.results.map(personToMediaItem) ?? [],
  );

  protected readonly totalPages = computed(() =>
    Math.min(this.peopleResource.value()?.total_pages ?? 1, MAX_PAGE),
  );

  protected goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: page > 1 ? page : null },
    });
  }
}
