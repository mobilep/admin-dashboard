import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// rxjs
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

// models
import { Template } from 'models/template';

// misc
import { environment } from '../../environments/environment';


const API_ENDPOINT = environment.apiEndpointV4;

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private state = {
    data$: new BehaviorSubject<Template[]>([]),
    loading$: new BehaviorSubject<boolean>(false),
    error$: new BehaviorSubject<string>(null)
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get data$(): Observable<Template[]> {
    return this.state.data$.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.state.loading$.asObservable();
  }

  get error$(): Observable<string> {
    return this.state.error$.asObservable();
  }

  loadTemplatesByCompany(companyId: string): Observable<Template[]> {
    this.state.loading$.next(true);
    return this.http.get<Template[]>(`${API_ENDPOINT}/company/${companyId}/template`).pipe(
      tap(templates => this.state.data$.next(templates)),
      catchError(this.errorHandler),
      finalize(() => this.state.loading$.next(false))
    );
  }

  loadTemplate(companyId: string, templateId: string): Observable<Template> {
    this.state.loading$.next(true);
    return this.http.get<Template>(`${API_ENDPOINT}/company/${companyId}/template/${templateId}`).pipe(
      catchError(this.errorHandler),
      finalize(() => this.state.loading$.next(false))
    )
  }

  create(companyId: string, template: Partial<Template>): Observable<Template> {
    this.state.loading$.next(true);

    return this.http.post<Template>(`${API_ENDPOINT}/company/${companyId}/template`, template).pipe(
      tap(template => {
        this.state.data$.next(this.state.data$.value.concat(template));
      }),
      catchError(this.errorHandler),
      finalize(() => this.state.loading$.next(false))
    )
  }

  update(companyId: string, templateId: string, template: Partial<Template>): Observable<Template> {
    this.state.loading$.next(true);

    return this.http.patch<Template>(`${API_ENDPOINT}/company/${companyId}/template/${templateId}`, template).pipe(
      tap(updatedTemplate => {
        this.state.data$.next(this.state.data$.value.reduce((acc, template) => acc.concat(template._id === updatedTemplate._id ? updatedTemplate : template), []));
      }),
      catchError(this.errorHandler),
      finalize(() => this.state.loading$.next(false))
    )
  }


  delete(companyId: string, templateId: string): Observable<any> {
    return this.http.patch(`${API_ENDPOINT}/company/${companyId}/template`, [templateId]).pipe(
      tap(() => {
        this.state.data$.next(this.state.data$.value.filter(template => template._id !== templateId))
      }),
      catchError(this.errorHandler),
    )
  }

  assignCoach({companyId, templateId, userIds}): Observable<Template> {
    return this.http.post(`${API_ENDPOINT}/company/${companyId}/template/${templateId}/assign`, userIds).pipe(
      catchError(this.errorHandler),
    )
  }

  resetStore(): void {
    this.state.data$.next([]);
    this.state.loading$.next(false);
    this.state.error$.next(null);
  }

  private errorHandler = (error: any): Observable<any> => {
    const errorMessage = this.translate.instant('common.fetchingError');
    this.state.error$.next(errorMessage);
    return throwError(error.message || errorMessage);
  };
}
