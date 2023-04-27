import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

// models
import { ScenarioMetrics } from '../../models/scenarioPracticesData';

@Component({
  selector: 'mpw-scenario-metrics',
  templateUrl: './scenario-metrics.component.html',
  styleUrls: ['./scenario-metrics.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScenarioMetricsComponent {
  @Input() metrics: ScenarioMetrics;
}
