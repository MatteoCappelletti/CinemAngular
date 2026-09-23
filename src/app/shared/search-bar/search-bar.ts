import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Barra di ricerca unica dell'header.
 * Non interroga TMDB da sola: porta alla pagina /ricerca, che è responsabile dei risultati.
 * Così la ricerca resta condivisibile e ricaricabile tramite URL (/ricerca?q=...).
 */
@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  private readonly router = inject(Router);

  protected readonly query = signal('');

  protected submit(): void {
    const query = this.query().trim();
    if (!query) {
      return;
    }
    this.router.navigate(['/ricerca'], { queryParams: { q: query } });
  }
}
