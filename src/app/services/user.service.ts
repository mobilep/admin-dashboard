import { share, map, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// service
import { HttpService } from './http.service';
// rxJs
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// environment
import { environment } from '../../environments/environment';
import { User } from '../models/user';

const API_ENDPOINT = environment.apiEndpoint;
const API_ENDPOINT_V4 = environment.apiEndpointV4;

@Injectable()
export class UserService {
  private loggedUserData: any;

  private currentUserData: any;
  private currentUserDataRequested: boolean;
  private newLoggedUserData = new BehaviorSubject<any>(null);
  public isManager$: Observable<boolean> = this.newLoggedUserData.pipe(
    map(user => user && !user['isSysAdmin'] && !user['isCompanyAdmin'] && user['managerCriteria'])
  );

  constructor(private http: HttpClient, private httpService: HttpService) {
    this.loggedUserData = {};
    this.currentUserData = {};
    this.currentUserDataRequested = false;
  }

  /**
   * @description - Method for delete User
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} userId - user id
   */
  deleteUser(companyId, userId: string): Observable<any> {
    return this.http.delete(`${API_ENDPOINT_V4}/company/${companyId}/user/${userId}`);
  }

  /**
   * @description - Method for delete Users
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {array} usersArr - user ids
   */
  deleteUsers(companyId, usersArr: string[]): Observable<any> {
    return this.http.patch(`${API_ENDPOINT_V4}/company/${companyId}/user`, usersArr);
  }

  /**
   * @description - Method for edit user
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} userId - user id
   * @param {object} data - user object
   */
  editUser(companyId, userId, data): Observable<any> {
    return this.http.patch(`${API_ENDPOINT_V4}/company/${companyId}/user/${userId}`, data);
  }

  /**
   * @description - Method for get current user
   * @returns {Observable}
   * @memberOf UserService
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/user`);
  }

  /**
   * @description - Method for get user by id
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} userId - user id
   */
  getUserInfo(companyId, userId): Observable<any> {
    return this.http.get(`${API_ENDPOINT_V4}/company/${companyId}/user/${userId}`);
  }

  /**
   * @description - Method for filter users in company
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   */
  getUsersInCompany(companyId: string): Observable<User[]> {
    return this.http
      .get<User[]>(`${API_ENDPOINT_V4}/company/${companyId}/user`)
      .pipe(map(res => res.filter(item => item.isActive === true)));
  }

  /**
   * @description - Method for set Logged User Data
   * @constructor
   * @param {object} user object.
   * @memberOf UserService
   */
  setLoggedUserData(user) {
    this.currentUserData = user;
    this.newLoggedUserData.next(Object.assign({}, this.currentUserData));
  }

  /**
   * @description - Method for return Logged User Data
   * @returns object
   * @memberOf UserService
   */
  getLoggedUserData() {
    return this.currentUserData;
  }

  loadCurrentUserData() {
    this.getCurrentUser().subscribe(data => {
      this.currentUserData = Object.assign({}, data);
      this.newLoggedUserData.next(Object.assign({}, this.currentUserData));
    });
  }

  getCurrentUserData(): Observable<any> {
    // Ensure we're only requesting the user data once
    if (!this.currentUserDataRequested) {
      this.currentUserDataRequested = true;
      this.loadCurrentUserData();
    }
    return this.newLoggedUserData.asObservable().pipe(share());
  }

  /**
   * @description - Method for clear logged user data
   * @returns object
   * @memberOf UserService
   */
  clearLoggedUserData() {
    for (const prop of Object.keys(this.loggedUserData)) {
      delete this.loggedUserData[prop];
    }
  }
}
