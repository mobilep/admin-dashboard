import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// service
import { CompaniesService } from '../../services/companies.service';
// models
import { COMPANY } from '../../models/company';
// rxJs

import { Subscription } from 'rxjs';

@Component({
  selector: 'mpw-company',
  styleUrls: ['./companies.component.sass'],
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit, OnDestroy {
  public companies: COMPANY[];
  public company: COMPANY;
  private subscribeUrl: Subscription;

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAllCompanies();
    this.getCurrentCompany();
    this.subscribeUrl = this.activatedRoute.params.subscribe(() => {
      this.getCurrentCompany();
    });
  }

  ngOnDestroy() {
    this.subscribeUrl.unsubscribe();
  }

  addCompany() {
    this.router.navigate([`company/add`]);
  }

  getCurrentCompany() {
    this.companiesService.getSelectedCompanyStore().then(res => {
      this.company = res;
      if (res && res._id && res.isActive) {
        return this.router.navigate([`/company/${res._id}/metrics`]);
      }
    });
  }

  getAllCompanies() {
    this.companiesService.getCompaniesStore().then(res => {
      this.companies = res;
    });
  }
}
