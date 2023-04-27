import { timer } from 'rxjs';
import { filter, switchMapTo } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// ToastsManager
import { ToastrService } from 'ngx-toastr';
// MD
import { MatDialog } from '@angular/material/dialog';
// components
import { PeopleDeleteComponent } from '../people-delete/people-delete.component';
import { SendEmailComponent } from '../../../components/common/send-email/send-email.component';
import { ImportResultComponent } from '../import-result/import-result.component';
import { SendScenarioComponent, Data as SendScenarioData, Result as SendScenarioResult } from '../../../scenarios/send-scenario/send-scenario.component';

// service
import { CountriesService } from '../../../services/countries.service';
import { UserService } from '../../../services/user.service';
import { CSVService } from '../../../services/csv.service';

// models
import { User } from '../../../models/user';

@Component({
  selector: 'mpw-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.sass']
})
export class PeopleListComponent implements OnInit, OnDestroy {
  private selectCompany: string;
  public people: User[] = [];
  public loading: boolean;
  private subscribeUrl: any;
  public languages: any[] = [];
  public countries: any[] = [];
  public selectUsers: string[] = [];

  constructor(
    private countriesService: CountriesService,
    private translate: TranslateService,
    private userService: UserService,
    private csvService: CSVService,
    private router: Router,
    public dialog: MatDialog,
    public toasts: ToastrService,
    private route: ActivatedRoute
  ) {
    this.getCompanyIdFromURL();
  }

  ngOnInit(): void {
    this.subscribeUrlFn();
    this.getAllPeople();
    this.getCountries();
  }

  ngOnDestroy(): void {
    this.subscribeUrl.unsubscribe();
  }

  getCountries() {
    this.countriesService.getCountries().then(res => {
      this.countries = res;
    });
  }

  // URL
  subscribeUrlFn() {
    this.subscribeUrl = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.getCompanyIdFromURL();
      this.getAllPeople();
    });
  }

  getCompanyIdFromURL() {
    this.selectCompany = this.route.snapshot.pathFromRoot[1].url[1].path;
  }

  getScreenHeight(num) {
    if (window.outerHeight < num) {
      return '300px';
    } else {
      return 'initial';
    }
  }

  showToasts(text, type?) {
    if (type && type === 'error') {
      this.toasts.show(`<span>${text}</span>`, null, { enableHtml: true, toastClass: 'toast-custom' });
    } else {
      this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
        enableHtml: true,
        toastClass: 'toast-custom'
      });
    }
  }

  // PEOPLE
  getAllPeople() {
    this.loading = true;
    this.userService.getUsersInCompany(this.selectCompany).subscribe(
      res => {
        this.people = res;
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.router.navigate(['/']);
      }
    );
  }

  deleteUsers(ids: string[]): void {
    const dialogRef = this.dialog.open(PeopleDeleteComponent, {
      width: '350px',
      data: ids,
      position: {
        top: '20px'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.message) {
        this.showToasts(result.message);
      }

      if (result.person_id) {
        this.deleteUserFromUsersStore(result.person_id);
      }

      if (result.people && result.people.length > 0) {
        result.people.forEach(item => this.deleteUserFromUsersStore(item));
      }
    });
  }

  deleteUserFromUsersStore(id: string) {
    this.people = this.people.filter(user => user._id !== id);
    this.removeUserIdFromSelectUsers(id);
  }

  removeAllUsers() {
    this.deleteUsers(this.selectUsers);
  }

  deletePerson(id: string): void {
    this.deleteUsers([id]);
  }

  onSelectionChange(ids: string[]) {
    this.selectUsers = ids;
  }

  removeUserIdFromSelectUsers(id: string) {
    this.selectUsers = this.selectUsers.filter(uid => uid !== id);
  }

  // SEND EMAIL
  sendOneEmail(uid) {
    const selectedUser = [uid];

    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '460px',
      height: this.getScreenHeight(550),
      data: selectedUser,
      disableClose: true,
      position: {
        top: '20px'
      }
    });
    dialogRef.afterClosed().subscribe(sentList => {
      if (sentList && this.people.length > 0) {
        this.people.forEach(p => {
          if (sentList.indexOf(p._id) >= 0) {
            p.isInviteSent = true;
          }
        });
      }
    });
  }

  sendEmailAllUsers() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '460px',
      height: this.getScreenHeight(550),
      data: this.selectUsers,
      disableClose: true,
      position: {
        top: '20px'
      }
    });
    dialogRef.afterClosed().subscribe(sentList => {
      if (sentList && this.people.length > 0) {
        this.people.forEach(p => {
          if (sentList.indexOf(p._id) >= 0) {
            p.isInviteSent = true;
          }
        });
      }
    });
  }

  showSendScenarioDialog(): void {
    this.dialog.open<SendScenarioComponent, SendScenarioData, SendScenarioResult>(
      SendScenarioComponent,
      {
        ...SendScenarioComponent.config,
        data: {
          companyId: this.selectCompany,
          userIds: this.selectUsers
        }
    });
  }

  showImportResult(res) {
    this.dialog.open(ImportResultComponent, {
      width: '70%',
      height: this.getScreenHeight(550),
      data: res,
      position: {
        top: '20px'
      }
    });
  }

  fileOnChange(fileInput: any) {
    const fileList: FileList = fileInput.target.files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();

      formData.append('importCsvFile', file);

      if (file.size > 50555052) {
        this.showToasts(this.translate.instant('firstSizeExceeds'), 'error');
        return false;
      }

      this.loading = true;

      timer(1000)
        .pipe(switchMapTo(this.csvService.connectToImportSSE(this.selectCompany)))
        .subscribe(
          results => {
            this.handleImportResults(results);
          },
          error => {
            this.loading = false;
          }
        );

      timer(1000)
        .pipe(switchMapTo(this.csvService.importUsers(this.selectCompany, formData)))
        .subscribe(
          res => {
            fileInput.target.value = '';
          },
          error => {
            this.loading = false;

            if (error && error.error) {
              this.showToasts(error.error.message, 'error');
            } else {
              this.showToasts('Upload failed, please try again', 'error');
            }
          }
        );
    }
  }

  handleImportResults({ result, status }): void {
    if (status === 'finished') {
      this.loading = false;
      this.getAllPeople();
      this.showImportResult(result);
    }
  }
}
