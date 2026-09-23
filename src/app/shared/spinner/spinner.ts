import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Indicatore di caricamento riutilizzato da tutte le pagine. */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  readonly label = input('Caricamento…');
}
