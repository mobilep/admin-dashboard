import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const requestWithHeaders = this.getRequestWithHeaders(req);

    return next.handle(requestWithHeaders).pipe(
      catchError(error => {
        console.error(error);
        return observableThrowError(error);
      })
    );
  }

  getRequestWithHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.cookieService.get('accessToken') || this.cookieService.get('accessTokenReset');

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
  }
}
