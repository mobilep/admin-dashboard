import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// rxjs
import { tap, catchError, finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

// models
import { Criteria } from 'models/criteria';

// misc
import { environment } from '../../environments/environment';


const API_ENDPOINT = environment.apiEndpointV4;

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {
  private state = {
    data: new BehaviorSubject<Criteria[]>([]),
    loading: new BehaviorSubject<boolean>(false),
    error: new BehaviorSubject<string>(null)
  };

  constructor(private http: HttpClient, private translate: TranslateService) {}

  get data$(): Observable<Criteria[]> {
    return this.state.data.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.state.loading.asObservable();
  }

  get error$(): Observable<string> {
    return this.state.error.asObservable();
  }

  load(companyId: string): Observable<Criteria[]> {
    this.state.loading.next(true);
    return this.http.get<Criteria[]>(`${API_ENDPOINT}/company/${companyId}/criteria`).pipe(
      tap(templates => this.state.data.next(templates)),
      catchError(this.errorHandler),
      finalize(() => this.state.loading.next(false))
    );
  }

  create(companyId: string, criteriaName: string): Observable<Criteria> {
    this.state.loading.next(true);
    return this.http.post<Criteria>(`${API_ENDPOINT}/company/${companyId}/criteria`, {name: criteriaName}).pipe(
      tap(criteria => this.state.data.next(this.state.data.value.concat(criteria))),
      catchError(this.errorHandler),
      finalize(() => this.state.loading.next(false))
    );
  }

  resetStore(): void {
    this.state.data.next([]);
    this.state.loading.next(false);
    this.state.error.next(null);
  }

  private errorHandler = (error: any): Observable<any> => {
    const errorMessage = this.translate.instant('common.fetchingError');
    this.state.error.next(errorMessage);
    return throwError(error.message || errorMessage);
  };
}
