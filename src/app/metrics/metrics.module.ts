import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartistModule } from 'ng-chartist';

// Modules
import { MetricsRoutingModule } from './metrics-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { MetricsComponent } from './metrics/metrics.component';
import { ChartCardComponent } from './chart-card/chart-card.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { ScoreTileComponent } from './score-tile/score-tile.component';

// Pipes
import { DaysRangePipe } from './pipes/days-range.pipe';

@NgModule({
  declarations: [MetricsComponent, ChartCardComponent, DaysRangePipe, ChartLegendComponent, ScoreTileComponent],
  imports: [CommonModule, MetricsRoutingModule, SharedModule, ChartistModule]
})
export class MetricsModule {}
