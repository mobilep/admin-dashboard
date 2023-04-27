import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// Service
import { CookieService } from 'ngx-cookie';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
// rxJs

import { Observable } from 'rxjs';
// API
import { environment } from '../../environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

const jwtHelper = new JwtHelperService();

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  /**
   * @description - Method for user authorization
   * @param {{}} credentials
   * @returns {Observable}
   * @memberOf AuthService
   */
  signIn(credentials: object): Observable<any> {
    return this.http.put(`${API_ENDPOINT}/auth`, credentials);
  }

  /**
   * @description Send request to forgot password`
   * @param {any} body
   * @returns {Observable}
   * @memberOf AuthService
   */
  sendResetEmail(body: object): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/auth/forgot-password`, body).pipe(map(() => 'success'));
  }

  /**
   * @description Send request to reset password`
   * @param {any} body
   * @returns {Observable}
   * @memberOf AuthService
   */
  resetPass(body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/auth/new-password`, body).pipe(map(() => 'success'));
  }

  /**
   * @description Send request to change password`
   * @param {any} body
   * @returns {Observable}
   * @memberOf AuthService
   */
  changePassword(body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/auth/change-password`, body).pipe(map(() => 'success'));
  }

  /**
   * @description - Method for set auth token to cookie`
   * @param {any} token
   * @memberOf AuthService
   */
  setAuthTokenToStorage(token) {
    this.cookieService.put('accessToken', token, {
      expires: jwtHelper.getTokenExpirationDate(token)
    });
  }

  setFirebaseAccessTokenToStorage(token) {
    this.cookieService.put('FIREBASE_ACCESS_TOKEN', token);
  }

  /**
   * @description - Method for set reset token to cookie`
   * @param {any} token
   * @memberOf AuthService
   */
  setAuthTokenToStorageReset(token) {
    this.cookieService.put('accessTokenReset', token, {
      expires: jwtHelper.getTokenExpirationDate(token)
    });
  }

  /**
   * @description - Method for return access token in cookie
   * @returns string
   * @memberOf AuthService
   */
  getAuthTokenFromStorage() {
    return this.cookieService.get('accessToken');
  }

  getFirebaseAccessTokenFromStorage() {
    return this.cookieService.get('FIREBASE_ACCESS_TOKEN');
  }

  /**
   * @description - Method for log out
   * > Remove user info from AuthService and cookies
   * > Redirect to login page
   * @returns {boolean}
   * @memberOf AuthService
   */
  logOut() {
    this.clearUser();
    return this.router.navigate(['auth/sign-in']);
    // return false;
  }

  /**
   * @description - Method for clear User data
   * > Remove user info from AuthService and cookies
   * @returns {boolean}
   * @memberOf AuthService
   */
  clearUser() {
    this.userService.clearLoggedUserData();
    this.cookieService.removeAll();
  }
}
