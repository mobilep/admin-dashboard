import { Component, Inject, OnInit } from '@angular/core';
// vendor
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
// service
import { UserService } from '../../../services/user.service';
import { CompaniesService } from '../../../services/companies.service';
// models
import { COMPANY } from '../../../models/company';

@Component({
  selector: 'mpw-people-delete',
  templateUrl: './people-delete.component.html',
  styleUrls: ['./people-delete.component.sass']
})
export class PeopleDeleteComponent implements OnInit {
  private company: COMPANY;
  public validationError: string;
  public onePerson: boolean;

  constructor(
    public dialogRef: MatDialogRef<PeopleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public people: any,
    private userService: UserService,
    private companiesService: CompaniesService,
    private translate: TranslateService
  ) {
    this.companiesService.getSelectedCompanyStore().then(res => {
      this.company = res;
    });
  }

  ngOnInit() {
    this.countPeople();
  }

  countPeople() {
    if (this.people.length === 1) {
      this.onePerson = true;
    } else if (this.people.length > 1) {
      this.onePerson = false;
    }
  }

  onDelete() {
    if (this.onePerson) {
      this.deletePerson();
    } else {
      const peopleToDelete = this.transformPeopleObjects(this.people);
      this.deletePeople(this.company._id, peopleToDelete);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deletePerson() {
    this.userService.deleteUser(this.company._id, this.people[0]).subscribe(
      res => {
        this.dialogRef.close({
          message: this.translate.instant('personDelete'),
          person_id: this.people[0],
          company_id: this.company._id
        });
      },
      error => {
        this.validationError = error.error.message;
      }
    );
  }

  deletePeople(companyId: string, people: any[]) {
    this.userService.deleteUsers(companyId, people).subscribe(
      () => {
        const users = [];
        people.forEach(item => users.push(item._id));
        this.dialogRef.close({
          message: this.translate.instant('peopleDelete'),
          people: users
        });
      },
      error => {
        this.validationError = error.error.message;
      }
    );
  }

  transformPeopleObjects(people: string[]): any[] {
    return people.map(item => ({ _id: item, isActive: false }));
  }
}
