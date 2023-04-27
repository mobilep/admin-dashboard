import { filter } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// vendor
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
// component
import { EditPasswordComponent } from '../../../components/profile/edit-password/edit-password.component';
import { CompanyDeleteComponent } from '../../../components/companies/company-delete/company-delete.component';
// service
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { CompaniesService } from '../../../services/companies.service';
// models
import { COMPANY } from '../../../models/company';
import { Subscribable, Subscription } from 'rxjs';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'mpw-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public companies$: Subscribable<COMPANY[]>;

  public company: COMPANY;
  public companies: COMPANY[];

  public isAdmin: boolean;
  public isManager: boolean;
  public currentLanguage: string;
  public loaded: boolean;
  private companyid: string;
  public subscribeUrl: any;
  public companiesSubscription: any;
  public currentUser: any;
  public currentUserSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private companiesService: CompaniesService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    public toasts: ToastrService,
    private storeService: StoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdmin = false;
    this.isManager = false;
    this.loaded = false;
    this.companiesService.getCompaniesStore().then(res => {
      this.companies = res;
    });
    this.companiesService.getSelectedCompanyStore().then(res => {
      this.company = res;
    });
    this.subscribeDialog();
    this.companies$ = this.storeService.select('companies');
  }

  ngOnInit() {
    this.getStorageUserData();

    this.companiesSubscription = this.companiesService.companiesStoreChanged.subscribe((companies: COMPANY[]) => {
      this.companies = companies.filter(item => item.isActive === true);
    });

    this.subscribeUrl = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
      if (e && e['url']) {
        if (e['url'].indexOf('company') > -1) {
          // this.getStorageUserData();
          const url = e['url'].split('/');
          if (url && url.length && url.length > 1) {
            this.companyid = url[2];
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscribeUrl.unsubscribe();
    this.companiesSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  get isActive() {
    return Boolean(this.currentUser) && this.loaded;
  }

  getStorageUserData() {
    // Subscribe to the current user data observable
    this.currentUserSubscription = this.userService.getCurrentUserData().subscribe(
      data => {
        if (data !== null) {
          this.currentUser = data;
          this.isAdminOrManager(data);
          setTimeout(() => this.onChangeCompany(data), 0);
          this.checkUserLanguage(data);
        }
      },
      () => {
        this.authService.logOut();
      }
    );
  }

  checkUserLanguage(user) {
    if (user.lang && user.lang !== '') {
      if (user.lang === 'fr') {
        this.currentLanguage = 'fr';
      } else {
        this.currentLanguage = 'en';
      }
      this.translate.use(this.currentLanguage);
    }
  }

  changeLanguage(lang) {
    this.currentLanguage = lang;
    this.translate.use(lang);
  }

  isAdminOrManager(user) {
    if (user['isSysAdmin']) {
      this.isAdmin = true;
    }
    if (!user['isSysAdmin'] && !user['isCompanyAdmin'] && user['managerCriteria']) {
      this.isManager = true;
    }
  }

  onChangeCompany(user) {
    if (this.isAdmin) {
      this.companiesService.getCompanies().subscribe(
        res => {
          this.companiesService.setCompaniesStore(res);
          this.loaded = true;
          this.companies = res;
          this.onSelectedCompany();
        },
        error => {
          console.error('Error: ', error);
        }
      );
    } else {
      this.companiesService.getCompanyInfo(user._company).subscribe(
        res => {
          this.companiesService.setCompanyToStore(res);
          this.companiesService.selectCompanyInStore(res);
          this.loaded = true;
          this.companies.push(res);
          this.openCompanyHomePage(res._id);
        },
        error => {
          console.error('Error: ', error);
        }
      );
    }
  }

  openCompanyHomePage(companyId: string): void {
    this.router.navigate([`company/${companyId}/metrics`]);
  }

  onSelectedCompany() {
    if (this.companies.length) {
      if (this.companyid) {
        const selectCompany = this.companies.filter(item => item._id === this.companyid);
        this.companiesService.selectCompanyInStore(selectCompany[0]);
        // this.router.navigate([`company/${this.companyid}/people/list`]);
      } else {
        this.companiesService.selectCompanyInStore(this.companies[0]);
        this.openCompanyHomePage(this.companies[0]._id);
      }
    }
  }

  findSelectCompany(company) {
    this.companiesService.updateSelectedCompanyInStore(company);
    this.openCompanyHomePage(company._id);
    this.cdr.detectChanges(); // detect changes manually to update routerLinkActive binding
  }

  getWindowHeight(num) {
    if (window.outerHeight < num) {
      return '300px';
    } else {
      return 'initial';
    }
  }

  onDeleteCompany() {
    this.dialog.open(CompanyDeleteComponent, {
      width: '350px',
      data: this.company,
      height: this.getWindowHeight(550),
      position: {
        top: '20px'
      }
    });
  }

  editCompany() {
    this.router.navigate([`company/${this.company._id}/edit`]);
  }

  createCompany() {
    this.router.navigate([`company/add`]);
  }

  editPassword() {
    this.dialog.open(EditPasswordComponent, {
      width: '460px',
      height: this.getWindowHeight(550),
      position: {
        top: '20px'
      }
    });
  }

  onLogOut() {
    this.toasts.clear();
    setTimeout(() => {
      this.authService.logOut();
    }, 0);
  }

  subscribeDialog() {
    this.dialog.afterAllClosed.subscribe(() => {
      this.checkLocalStorage();
    });
  }

  checkLocalStorage() {
    if (localStorage.getItem('notificationMessage')) {
      const message = localStorage.getItem('notificationMessage');
      this.showToasts(message);
      localStorage.removeItem('notificationMessage');
    }

    if (localStorage.getItem('notificationHeaderMessage')) {
      const message = localStorage.getItem('notificationHeaderMessage');
      this.showToasts(message);
      localStorage.removeItem('notificationHeaderMessage');
    }
  }

  showToasts(text) {
    this.toasts.clear();
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }

  toggleTouchFn(event) {
    const dropDownList = event.target.closest('body').querySelectorAll('.select-style');
    const dropDownParent = event.target.closest('.select-style');

    if (dropDownParent.classList.contains('select-style_active')) {
      dropDownParent.classList.remove('select-style_active');
    } else {
      if (dropDownList.length) {
        for (let i = 0; i < dropDownList.length; i++) {
          dropDownList[i].classList.remove('select-style_active');
        }
      }
      dropDownParent.classList.add('select-style_active');
    }
  }

  toggleClickFn(event) {
    event.target.classList.add('select-style_active');
  }

  toggleLeaveFn(event) {
    event.target.classList.remove('select-style_active');
  }
}
