import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mpw-metric-tile',
  templateUrl: './metric-tile.component.html',
  styleUrls: ['./metric-tile.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricTileComponent {
  @Input() value: number;
  @Input() label = '';
  @Input() iconName = '';
}
