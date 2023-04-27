import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
// vendor
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
// service
import { CompaniesService } from '../../../services/companies.service';
// models
import { COMPANY } from '../../../models/company';

@Component({
  selector: 'mpw-company-delete',
  templateUrl: './company-delete.component.html',
  styleUrls: ['./company-delete.component.sass']
})
export class CompanyDeleteComponent {
  public companies: COMPANY[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public company: any,
    private companiesService: CompaniesService,
    public dialog: MatDialog,
    private router: Router,
    private toasts: ToastrService,
    private translate: TranslateService,
  ) {
    this.companiesService.getCompaniesStore().then(res => {
      this.companies = res;
    });
  }

  public deleteCompany(): void {
    this.companiesService.removeCompany(this.company._id).subscribe(
      res => {
        this.companiesService.deleteCompanyFromStore(this.company._id);
        if (this.companies.length) {
          let company = this.companies[0];
          if (!company.isActive && this.companies[1].isActive) {
            company = this.companies[1];
          }
          this.companiesService.selectCompanyInStore(company);
          this.router.navigate([`/company/${company._id}/people/list`]).then(() => {
            this.showToasts(this.translate.instant('companyDelete'));
            this.closeDialog();
          });
        }
      },
      error => {
        console.error('Error: ', error);
      }
    );
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  private showToasts(text: string): void {
    this.toasts.clear();
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }
}
