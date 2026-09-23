import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaItem } from '../../models/media-item';
import { MediaCard } from '../media-card/media-card';

/**
 * Contenitore di card, in due varianti:
 * - `grid` (default): griglia che va a capo, per le pagine di elenco;
 * - `row`: riga a scorrimento orizzontale, per le sezioni della home.
 */
@Component({
  selector: 'app-media-grid',
  imports: [MediaCard],
  templateUrl: './media-grid.html',
  styleUrl: './media-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaGrid {
  readonly items = input.required<MediaItem[]>();
  readonly layout = input<'grid' | 'row'>('grid');
  readonly emptyMessage = input('Nessun risultato.');
}
