import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-details',
  styleUrl: './details.css',
  templateUrl: './details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {}