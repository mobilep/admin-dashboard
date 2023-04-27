import { Component, Input, OnChanges } from '@angular/core';

// models
import { ChartData } from '../../models/charts-data-response';

// misc
import { OBJECT_UTILS } from '../../utils/object-helpers';

const CHART_CONFIG = {
  width: 150,
  height: 150,
  donut: true,
  donutWidth: 22,
  donutSolid: true,
  startAngle: 270,
  showLabel: false
};

@Component({
  selector: 'mpw-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.sass']
})
export class ChartCardComponent implements OnChanges {
  @Input() title = '';
  @Input() chartData: ChartData;
  options = { ...CHART_CONFIG };
  data = {};

  ngOnChanges(): void {
    this.setChartData();
  }

  setChartData(): void {
    if (!this.chartData) return;
    const ranges = this.chartData.ranges;
    this.data = {
      series: ranges.map(OBJECT_UTILS.pluck('count'))
    };

    // if donut has only one sector - draw it thinner to compensate stroke-width 0
    if (ranges.length === 1) {
      this.options.donutWidth = 20;
    }
  }
}
