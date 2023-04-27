import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// service
import { HttpService } from './http.service';
// environment
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

const API_ENDPOINT = environment.apiEndpoint;
const API_ENDPOINT_V4 = environment.apiEndpointV4;

@Injectable()
export class CSVService {
  constructor(private httpService: HttpService, private http: HttpClient, private ngZone: NgZone) {}

  /**
   * @description - Made request for Upload CSV File of User List
   * @memberOf CSVService
   * @constructor
   * @param {string} id - Company id.
   * @param {object} body - The body of the File CSV.
   * @returns {Observable}
   */
  importUsers(id: string, body: FormData) {
    return this.http.post(`${API_ENDPOINT_V4}/company/${id}/import`, body, { responseType: 'text' });
  }

  /**
   * @description - Made request for export CSV File of reporting
   * @memberOf CSVService
   * @constructor
   * @param {string} id - Company id.
   * @returns {Observable}
   */
  exportReportingLink(id: string) {
    return `${API_ENDPOINT_V4}/${id}/export/${this.httpService.generateQueryToken()}`;
  }

  connectToImportSSE(companyId: string): Observable<any> {
    const token = this.httpService.generateQueryToken();
    const sseSubject = new Subject();
    const sse = new EventSource(`${API_ENDPOINT_V4}/company/${companyId}/importStatus${token}`);

    sse.onmessage = e => {
      try {
        const data = JSON.parse(e.data);

        // angular change detection is not triggered automatically
        this.ngZone.run(() => {
          sseSubject.next(data);
        });

        if (data.status === 'finished') {
          console.log('finished');

          sse.close();
          sseSubject.complete();
        }
      } catch (error) {
        sseSubject.error(error);
      }
    };

    return sseSubject.asObservable();
  }
}
