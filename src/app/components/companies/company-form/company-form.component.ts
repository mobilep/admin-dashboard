import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// service
import { CompaniesService } from '../../../services/companies.service';
// vendor
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_DAYS_TO_SHOW_REMINDER = 3;

@Component({
  selector: 'mpw-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.sass']
})
export class CompanyFormComponent implements OnInit {
  public company = { info: '', name: '' };
  public validationError: string;
  public companyId: any;
  public companyForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasts: ToastrService,
    private translate: TranslateService,
    private companiesService: CompaniesService
  ) { }

  ngOnInit(): void {
    this.buildFormModel();
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.companyId = params.id;
        this.getCompany();
      }
    });
  }

  buildFormModel() {
    this.companyForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.pattern('[A-Za-zÀ-ž0-9_\\s&.-]{1,255}')
      ]),
      info: new FormControl('', [Validators.maxLength(4096)]),
      isMailNotification: new FormControl(true),
      sendReminder: new FormControl(DEFAULT_DAYS_TO_SHOW_REMINDER, [
        Validators.pattern(/^[1-9][0-9]*$/),
        Validators.required
      ])
    });
  }

  isReminderValidationVisible(): boolean {
    const formControl = this.companyForm.get('sendReminder');

    return formControl.touched && formControl.invalid;
  }

  getCompany() {
    this.companiesService.getCompanyInfo(this.companyId).subscribe(
      res => {
        this.companiesService.selectCompanyInStore(res);
        this.company = res;
        this.validationError = '';

        this.companyForm.patchValue(res);
      },
      error => {
        this.validationError = error;
      }
    );
  }

  onSubmit({ value, valid }) {
    if (valid) {
      if (this.companyId) {
        this.saveCompany(value);
      } else {
        this.addCompany(value);
      }
    }
  }

  saveCompany(body): void {
    if (body.name.trim().length < 1) {
      this.companyForm.patchValue({ name: null });
    } else {
      this.companiesService.updateCompany(this.companyId, body).subscribe(
        res => {
          this.company = res;
          this.companiesService.updateCompanyInStore(res);
          this.companiesService.updateSelectedCompanyInStore(res);

          this.goBack(res._id).then(() => {
            this.showToasts(this.translate.instant('detailsUpdated'));
          });
        },
        error => {
          this.validationError = error;
        }
      );
    }
  }

  showToasts(text: string): void {
    this.toasts.clear();
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }

  addCompany(body): void {
    if (body.name.trim().length < 1) {
      this.companyForm.patchValue({ name: null });
    } else {
      this.companiesService.addCompany(body).subscribe(
        res => {
          this.companiesService.addCompanyInStore(res);
          this.companiesService.selectCompanyInStore(res);

          this.goBack(res._id).then(() => {
            this.showToasts(this.translate.instant('companyCreated'));
          });
        },
        error => {
          this.validationError = error;
        }
      );
    }
  }

  goBack(companyId: string): Promise<boolean> {
    return this.router.navigate([`/company/${companyId}/people/list`]);
  }
}
