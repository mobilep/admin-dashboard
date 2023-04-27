import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {
  constructor(private cookieService: CookieService) {}

  /**
   * @description - Generate authorization header with jwt token
   * @returns {RequestOptions}
   * @memberOf HttpService
   */
  generateHttpHeaders(): { headers?: HttpHeaders } {
    const token = this.cookieService.get('accessToken') || this.cookieService.get('accessTokenReset');
    if (!token) return {};

    const headers = new HttpHeaders({ Authorization: token });
    return { headers };
  }

  generateQueryToken() {
    return `?Authorization=${this.cookieService.get('accessToken') || this.cookieService.get('accessTokenReset')}`;
  }
}
