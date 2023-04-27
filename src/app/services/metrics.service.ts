import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map, finalize } from 'rxjs/operators';

// models
import { GlobalMetrics } from '../models/globalMetrics';
import { ChartsDataResponse } from '../models/charts-data-response';

// misc
import { environment } from '../../environments/environment';
import { mapMetricsAPI } from '../apiMappers/metricsMappers';

const API_ENDPOINT = environment.apiEndpointV4;

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private state = {
    data: new BehaviorSubject<GlobalMetrics>(null),
    chartsData: new BehaviorSubject<ChartsDataResponse>(null),
    loading: new BehaviorSubject<boolean>(false),
    error: new BehaviorSubject<string>(null)
  };

  constructor(private http: HttpClient, private translate: TranslateService) {}

  loadMetrics(companyId: string): Observable<GlobalMetrics> {
    this.state.loading.next(true);
    return this.http.get<GlobalMetrics>(`${API_ENDPOINT}/company/${companyId}/report-admin`).pipe(
      map(mapMetricsAPI),
      tap(metrics => this.state.data.next(metrics)),
      catchError(this.errorHandler),
      finalize(() => this.state.loading.next(false))
    );
  }

  loadChartsData(companyId: string): Observable<ChartsDataResponse> {
    this.state.loading.next(true);
    return this.http.get<ChartsDataResponse>(`${API_ENDPOINT}/company/${companyId}/report-admin/chart`).pipe(
      tap(metrics => this.state.chartsData.next(metrics)),
      catchError(this.errorHandler),
      finalize(() => this.state.loading.next(false))
    );
  }

  get data$(): Observable<GlobalMetrics> {
    return this.state.data.asObservable();
  }

  get chartsData$(): Observable<ChartsDataResponse> {
    return this.state.chartsData.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.state.loading.asObservable();
  }

  get error$(): Observable<string> {
    return this.state.error.asObservable();
  }

  resetStore(): void {
    this.state.data.next(null);
    this.state.loading.next(false);
    this.state.error.next(null);
  }

  private errorHandler = (error: any): Observable<any> => {
    const errorMessage = this.translate.instant('common.fetchingError');
    this.state.error.next(errorMessage);
    return throwError(error.message || errorMessage);
  };
}
