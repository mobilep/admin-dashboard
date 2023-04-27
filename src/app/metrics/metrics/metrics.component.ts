import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

// services
import { MetricsService } from '../../services/metrics.service';
import { CSVService } from '../../services/csv.service';
import { UserService } from '../../services/user.service';

// models
import { GlobalMetrics } from '../../models/globalMetrics';
import { ChartsDataResponse } from '../../models/charts-data-response';

// misc
import { takeWhileAlive, AutoUnsubscribe } from '../../decorators/auto-unsubscribe';

@Component({
  selector: 'mpw-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.sass']
})
@AutoUnsubscribe()
export class MetricsComponent implements OnDestroy {
  public metrics$: Observable<GlobalMetrics> = this.metricsService.data$;
  public chartsData$: Observable<ChartsDataResponse> = this.metricsService.chartsData$;
  public loading$: Observable<boolean> = this.metricsService.loading$;
  public dataError$: Observable<string> = this.metricsService.error$;
  private companyId: string;
  public isManager$ = this.userService.isManager$;

  constructor(
    private metricsService: MetricsService,
    private route: ActivatedRoute,
    private csvService: CSVService,
    private userService: UserService
  ) {
    this.route.paramMap.pipe(takeWhileAlive(this)).subscribe(params => {
      this.companyId = params.get('id');
      this.metricsService.loadMetrics(this.companyId).subscribe();
      this.metricsService.loadChartsData(this.companyId).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.metricsService.resetStore();
  }

  exportCsvFile() {
    window.open(this.csvService.exportReportingLink(this.companyId));
  }
}
