import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// rxjs
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

// models
import { ScenarioStatistic } from '../models/scenario';
import { Coach } from '../models/coach';
import { ScenarioPracticesData, MappedScenarioPracticesData } from '../models/scenarioPracticesData';
import { VideoByLearner } from 'models/video-by-learner';

// misc
import { environment } from '../../environments/environment';
import { OBJECT_UTILS } from '../utils/object-helpers';
import { ARRAY_UTILS } from '../utils/array.helpers';
import { mapPracticesData } from '../apiMappers/scenarioMappers';

const API_ENDPOINT = environment.apiEndpointV4;

@Injectable({
  providedIn: 'root'
})
export class ScenariosService {
  private state = {
    data: new BehaviorSubject<ScenarioStatistic[]>([]),
    coaches: new BehaviorSubject<Coach[]>([]),
    loading: new BehaviorSubject<boolean>(false),
    error: new BehaviorSubject<string>(null)
  };

  constructor(private http: HttpClient, private translate: TranslateService) {}

  get data$(): Observable<ScenarioStatistic[]> {
    return this.state.data.asObservable();
  }

  get coaches$(): Observable<Coach[]> {
    return this.state.coaches.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.state.loading.asObservable();
  }

  get error$(): Observable<string> {
    return this.state.error.asObservable();
  }

  loadScenariosByCompany(companyId: string): Observable<ScenarioStatistic[]> {
    this.state.loading.next(true);
    return this.http.get<ScenarioStatistic[]>(`${API_ENDPOINT}/company/${companyId}/admin-scenario`).pipe(
      tap(scenarios => {
        this.state.data.next(scenarios);
        this.state.coaches.next(this.getCoachesFromScenarios(scenarios));
      }),
      catchError(this.errorHandler),
      finalize(() => this.state.loading.next(false))
    );
  }

  getOneScenariosByCompany(companyId: string, scenarioId: string): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}/company/${companyId}/admin-scenario/${scenarioId}`);
  }

  getScenarioPracticesData(companyId: string, scenarioId: string): Observable<MappedScenarioPracticesData> {
    return this.http
      .get<ScenarioPracticesData>(
        `${environment.apiEndpointV4}/company/${companyId}/admin-scenario/${scenarioId}/practice`
      )
      .pipe(map(mapPracticesData));
  }

  getVideosByLearnerIds(companyId: string, scenarioId: string, learnerIds: string[]): Observable<VideoByLearner[]> {
    const filterString = learnerIds.map(id => `userIds[]=${id}`).join('&');
    const query = !learnerIds.length ? '' : `?${filterString}`;

    return this.http
      .get<VideoByLearner[]>(
        `${environment.apiEndpointV4}/company/${companyId}/admin-scenario/${scenarioId}/learners-videos${query}`
      );
  }

  getScenarioPracticeMessages(companyId: string, scenarioId: string, practiceId: string): Observable<any> {
    return this.http.get(
      `${environment.apiEndpoint}/company/${companyId}/admin-scenario/${scenarioId}/practice/${practiceId}`
    );
  }

  resetStore(): void {
    this.state.data.next([]);
    this.state.coaches.next([]);
    this.state.loading.next(false);
    this.state.error.next(null);
  }

  private errorHandler = (error: any): Observable<any> => {
    const errorMessage = this.translate.instant('common.fetchingError');
    this.state.error.next(errorMessage);
    return throwError(error.message || errorMessage);
  };

  private getCoachesFromScenarios(scenarios: ScenarioStatistic[]): Coach[] {
    const scenarioCoaches = scenarios.map(OBJECT_UTILS.pluck<Coach>('coach'));

    return ARRAY_UTILS.unique<Coach>(scenarioCoaches);
  }
}
