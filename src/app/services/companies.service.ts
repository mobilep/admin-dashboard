import { throwError as observableThrowError, Observable, Subject } from 'rxjs';

import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// service
import { HttpService } from './http.service';

// models
import { COMPANY } from '../models/company';
// environment
import { environment } from '../../environments/environment';
import { StoreService } from './store.service';
import { UserService } from './user.service';

const API_ENDPOINT = environment.apiEndpoint;
const API_ENDPOINT_V4 = environment.apiEndpointV4;

@Injectable()
export class CompaniesService {
  private companiesStore;
  private selectedCompanyStore;
  companiesStoreChanged = new Subject<COMPANY[]>();

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private storeService: StoreService,
    private userService: UserService
  ) {
    this.companiesStore = [];
    this.selectedCompanyStore = {};
  }

  countManagerScenario(id, criteria) {
    return this.http.get(`${API_ENDPOINT}/company/${id}/test-admin-scenario`, { params: { criteria } });
  }

  /**
   * @description - Made request to get all companies
   * @memberOf CompaniesService
   * @constructor
   * @returns {Observable}
   */
  getCompanies(): Observable<COMPANY[]> {
    return this.http.get<any>(`${API_ENDPOINT}/company`).pipe(
      map(res => res.filter(item => item.isActive === true)),
      tap(companies => this.storeService.set('companies', companies)),
      catchError(this.errorHandler)
    );
  }

  /**
   * @description - Made request for Add Company
   * @memberOf CompaniesService
   * @constructor
   * @param {object} body - The body of the company form.
   * @returns {Observable}
   */
  addCompany(body: object): Observable<any> {
    return this.http.post(`${API_ENDPOINT_V4}/company`, body).pipe(
      tap(company => this.storeService.set('company', company)),
      tap(company => this.storeService.set('companies', [company, ...this.storeService.value.companies])),
      catchError(this.errorHandler)
    );
  }

  /**
   * @description - Made request for Update Company
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - Company id.
   * @param {object} body - The body of the company form.
   * @returns {Observable}
   */
  updateCompany(id: string, body: object): Observable<any> {
    return this.http.patch<any>(`${API_ENDPOINT_V4}/company/${id}`, body).pipe(
      tap(company => this.storeService.set('company', company)),
      tap(company => {
        if (this.storeService.value.companies) {
          const index = this.storeService.value.companies.findIndex(item => item._id === company._id);
          this.storeService.value.companies.splice(index, 1, company);
        }
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * @description - Made request for Remove Company
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - Company id.
   * @returns {Observable}
   */
  removeCompany(id: string): Observable<any> {
    return this.http.delete(`${API_ENDPOINT}/company/${id}`).pipe(
      tap(() => {
        const index = this.storeService.value.companies.findIndex(company => company._id === id);
        this.storeService.value.companies.splice(index, 1);
      }),
      tap(() => this.storeService.set('company', null)),
      catchError(this.errorHandler)
    );
  }

  /**
   * @description - Made request for get Company info
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - Company id.
   */
  getCompanyInfo(id: string): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/company/${id}`).pipe(catchError(this.errorHandler));
  }

  /**
   * @description - Made witch invite users to company
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} body - body from select user.
   */
  inviteUserToCompany(companyId: string, body): Observable<any> {
    return this.http.post(`${API_ENDPOINT_V4}/company/${companyId}/user`, body);
  }

  /**
   * @description - Method for send invite email to user
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} body - body from select user.
   */
  sendInviteEmailToUser(companyId: string, body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/company/${companyId}/invite`, body);
  }

  /**
   * @description - Method for send invite to costume email address
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} body - costume email address.
   */
  sendTestEmail(companyId: string, body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/company/${companyId}/sendTestEmail`, body);
  }

  /**
   * @description - Method for return list companies in store
   * @memberOf CompaniesService
   * @returns Promise
   */
  getCompaniesStore(): Promise<COMPANY[]> {
    return Promise.resolve(this.companiesStore);
  }

  /**
   * @description - Method for set companies in store
   * @memberOf CompaniesService
   * @constructor
   * @param {array} res - array companies
   */
  setCompaniesStore(res) {
    this.companiesStore.length = 0;
    res.forEach(element => {
      this.companiesStore.push(element);
    });
  }

  /**
   * @description - Method for set company to store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  setCompanyToStore(company) {
    this.companiesStore.push(company);
    this.companiesStoreChanged.next(this.companiesStore);
  }

  /**
   * @description - Method for delete company from store
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - company id
   */
  deleteCompanyFromStore(id) {
    const index = this.companiesStore.findIndex(company => company._id === id);
    this.companiesStore.splice(index, 1);
    this.companiesStoreChanged.next(this.companiesStore);
  }

  /**
   * @description - Method for update company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  updateCompanyInStore(company) {
    const index = this.companiesStore.findIndex(item => item._id === company._id);
    this.companiesStore.splice(index, 1, company);
  }

  /**
   * @description - Method for add company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  addCompanyInStore(company) {
    this.companiesStore.push(company);
    this.companiesStoreChanged.next(this.companiesStore);
  }

  /**
   * @description - Method for select company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  selectCompanyInStore(company) {
    // Whenever a new company is selected clear any selected users from store
    Object.assign(this.selectedCompanyStore, company);
  }

  /**
   * @description - Method for update Selected company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} updateCompany - object company
   */
  updateSelectedCompanyInStore(updateCompany) {
    Object.assign(this.selectedCompanyStore, updateCompany);
  }

  /**
   * @description - Method for return list selected company in store
   * @memberOf CompaniesService
   * @returns Promise
   */
  getSelectedCompanyStore(): Promise<COMPANY> {
    return Promise.resolve(this.selectedCompanyStore);
  }

  private errorHandler(error: any): Observable<any> {
    return observableThrowError(error.error.message || 'Server error');
  }
}
