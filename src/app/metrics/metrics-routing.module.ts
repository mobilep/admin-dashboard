import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Components
import { MetricsComponent } from './metrics/metrics.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: MetricsComponent }
    ])
  ],
  exports: [RouterModule],
})
export class MetricsRoutingModule { }
