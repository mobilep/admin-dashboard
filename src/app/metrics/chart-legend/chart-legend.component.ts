import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

// models
import { DataRange } from '../../models/charts-data-response';

@Component({
  selector: 'mpw-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLegendComponent {
  @Input() ranges: DataRange[] = [];
  colors = ['#309fff', '#ffe038', '#ccd0d2', '#ffc0cb', '#f3663c'];
}
