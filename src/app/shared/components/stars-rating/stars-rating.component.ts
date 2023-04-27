import { Component, OnChanges, ChangeDetectionStrategy, Input } from '@angular/core';

const NUMBER_OF_STARS = 5;

@Component({
  selector: 'mpw-stars-rating',
  templateUrl: './stars-rating.component.html',
  styleUrls: ['./stars-rating.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarsRatingComponent implements OnChanges {
  @Input() value: number;
  @Input() size: 'sm' | 'md' = 'md';

  rateWidth: number;

  ngOnChanges(): void {
    if (this.value === undefined) return;

    this.rateWidth = (this.value / NUMBER_OF_STARS) * 100;
  }
}
