import { tap, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

// Service
import { CompaniesService } from '../../../services/companies.service';
import { CountriesService } from '../../../services/countries.service';
import { LanguagesService } from '../../../services/languages.service';
import { UserService } from '../../../services/user.service';

// models
import { Country } from '../../../models/country.interface';
import { Language } from '../../../models/language.interface';

// misc
import { AutoUnsubscribe, takeWhileAlive } from '../../../decorators/auto-unsubscribe';

@Component({
  selector: 'mpw-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.sass']
})
@AutoUnsubscribe()
export class PeopleFormComponent implements OnInit, OnDestroy {
  public languages: Language[];
  public countries: Country[];
  public user;
  private companyId: string;
  public uid: string;
  public passwordType: string;
  public labelPassword: string;
  public person: FormGroup;
  private subscribeUrl: any;
  public loaded: boolean;
  public validationError: string;
  public scenarioCount: number;

  public isSysAdmin: boolean;
  public isCompanyAdmin: boolean;
  private currentUserSubscription: Subscription;

  constructor(
    private languagesService: LanguagesService,
    private countriesService: CountriesService,
    private userService: UserService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private toasts: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {
    this.passwordType = 'password';
    this.subscribeUrlFn();
    this.scenarioCount = 0;
    this.loaded = false;
    this.isSysAdmin = null;
    this.isCompanyAdmin = null;
    this.labelPassword = this.translate.instant('show')
  }

  ngOnInit() {
    this.buildFormGroup();

    // Subscribe to current user data updates
    this.currentUserSubscription = this.userService.getCurrentUserData().subscribe(data => {
      if (data !== null) {
        this.isSysAdmin = data.isSysAdmin;
        this.isCompanyAdmin = data.isCompanyAdmin;
      }
    });

    this.route.params.subscribe((params: Params) => {
      if (params['uid']) {
        this.uid = params['uid'];
        this.getUserInfo();
      } else {
        this.initExtraInformationAtCreate();
        this.setAdminPassValidator();
        this.loaded = true;
      }
    });
    this.getLanguages();
    this.getCountries();
  }

  /**
   * @description - Component has loaded once user data has loaded and isSysAdmin has been resolved
   * @returns boolean
   */
  get hasLoaded() {
    return this.loaded && this.isSysAdmin !== null;
  }

  ngOnDestroy(): void {
    this.subscribeUrl.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  getLanguages() {
    this.countriesService.getCountries().then((res: Country[]) => {
      this.countries = res;
    });
  }

  getCountries() {
    this.languagesService.getLanguages().then((res: Language[]) => {
      this.languages = res;
    });
  }

  subscribeUrlFn() {
    this.subscribeUrl = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.getCompanyIdFromURL();
    });
  }

  buildFormGroup() {
    this.person = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern("[A-Za-zÀ-ž_\\s-.`']{1,30}")
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern("[A-Za-zÀ-ž_\\s-.`']{1,30}")
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required,
        Validators.pattern(
          "^[a-zA-ZÀ-ž0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-ZÀ-ž0-9]([a-zA-ZÀ-ž0-9-]*[a-z0-9])?(.[a-zA-ZÀ-ž0-9]" +
          '([a-zA-ZÀ-ž0-9-]*[a-zA-ZÀ-ž0-9])?)*'
        )
      ]),
      country: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [
        Validators.pattern('[A-Za-zÀ-ž0-9_\\s-.]{1,30}')
      ]),
      lang: new FormControl('fr', [Validators.required]),
      isCompanyAdmin: new FormControl(false),
      password: new FormControl('', [Validators.minLength(8), Validators.maxLength(64)]),
      managerCriteria: new FormControl('', [
        Validators.pattern(new RegExp(/^([\w][\w ]+:([\w][\w ]*(\|[\w][\w ]*)*),?)+$/))
      ]),
      _coach: new FormControl('', Validators.email),
      extraInformation: this.formBuilder.array([])
    });
    this.person
      .get('managerCriteria')
      .valueChanges.pipe(
        takeWhileAlive(this),
        debounceTime(500),
        distinctUntilChanged(),
        filter(() => this.person.get('managerCriteria').valid),
        switchMap(val => {
          return this.testManager(val);
        })
      )
      .subscribe();
  }

  setAdminPassValidator() {
    const passwordField = this.person.get('password');

    this.person.get('isCompanyAdmin').valueChanges.pipe(takeWhileAlive(this)).subscribe((isAdmin) => {
      if (isAdmin) {
        passwordField.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(64)])
      } else {
        passwordField.setValidators(null)
      }

      passwordField.updateValueAndValidity();
    })
  }

  testManager(val) {
    return this.companiesService.countManagerScenario(this.companyId, val).pipe(
      tap(count => {
        this.scenarioCount = Number(count);
      })
    );
  }

  getCompanyIdFromURL() {
    this.companyId = this.route.snapshot.pathFromRoot[1].url[1].path;
  }

  initExtraInformation() {
    return this.formBuilder.group({
      title: [''],
      description: ['']
    });
  }

  initExtraInformationAtCreate() {
    const control = <FormArray>this.person.controls['extraInformation'];
    const initData = [
      {
        title: 'Business Unit',
        description: ''
      },
      {
        title: 'Region',
        description: ''
      },
      {
        title: 'Country Region',
        description: ''
      },
      {
        title: 'Global Region',
        description: ''
      },
      {
        title: 'Custom 1',
        description: ''
      },
      {
        title: 'Custom 2',
        description: ''
      },
      {
        title: 'Custom 3',
        description: ''
      }
    ];
    initData.forEach(data => control.push(this.formBuilder.group(data)));
  }

  addExtraInformation() {
    const control = <FormArray>this.person.controls['extraInformation'];
    const addCtrl = this.initExtraInformation();
    control.push(addCtrl);
  }

  getUserInfo() {
    this.userService.getUserInfo(this.companyId, this.uid).subscribe(
      user => {
        if (user) {
          this.user = user;

          this.person.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            postcode: user.postcode,
            country: user.country,
            lang: user.lang,
            isCompanyAdmin: user.isCompanyAdmin,
            managerCriteria: user.managerCriteria || '',
            _coach: user._coach || '',
          });

          if (user.extraInformation.length) {
            for (let i = 0; i < user.extraInformation.length; i++) {
              this.addExtraInformation();
            }
          } else {
            this.addExtraInformation();
          }

          if (!user.havePassword) {
            this.setAdminPassValidator();
          }

          this.person.patchValue({ extraInformation: user.extraInformation });
          this.loaded = true;
        } else {
          this.goBack();
        }
      },
      () => {
        this.goBack();
      }
    );
  }

  onChangeIsCompanyAdmin(event) {
    if (event.target.checked === false) {
      this.person.patchValue({ password: '' });
    }
  }

  onSubmit({ value, valid }) {
    if (value.isCompanyAdmin === false) {
      delete value['password'];
    }

    if (value.isCompanyAdmin === true && value.password.trim() === '') {
      delete value['password'];
    }

    if (!this.isSysAdmin && !this.isCompanyAdmin) {
      delete value['managerCriteria'];
    }

    const myLocalArray = [];

    value.extraInformation.map(elem => {
      if (elem.title.trim().length || elem.description.trim().length) {
        myLocalArray.push(elem);
      }
    });

    value.extraInformation = myLocalArray;

    if (valid) {
      if (this.uid) {
        this.edit(value);
      } else {
        this.add(value);
      }
    }
  }

  add(body) {
    this.companiesService.inviteUserToCompany(this.companyId, [body]).subscribe(
      () => {
        this.goBack().then(() => {
          this.showToasts(this.translate.instant('personAdded'));
        });
      },
      error => {
        this.validationError = error?.error?.message;
      }
    );
  }

  edit(body) {
    this.userService.editUser(this.companyId, this.uid, body).subscribe(
      () => {
        this.goBack().then(() => {
          this.showToasts(this.translate.instant('detailsUpdated'));
        });
      },
      error => {
        console.error(error);
        this.validationError = error.error.message;
      }
    );
  }

  onPasswordType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.labelPassword = this.translate.instant('hide');
    } else {
      this.passwordType = 'password';
      this.labelPassword = this.translate.instant('show');
    }
  }

  goBack(): Promise<boolean> {
    return this.router.navigate([`company/${this.companyId}/people/list`]);
  }

  trackByFn(index: any) {
    return index;
  }

  showToasts(text: string): void {
    this.toasts.clear();
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }
}
