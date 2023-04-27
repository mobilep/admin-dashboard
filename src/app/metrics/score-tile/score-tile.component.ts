import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'mpw-score-tile',
  templateUrl: './score-tile.component.html',
  styleUrls: ['./score-tile.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreTileComponent {
  @Input() label = '';
  @Input() value: number;
}
