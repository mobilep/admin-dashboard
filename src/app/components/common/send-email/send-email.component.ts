import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// vendor
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
// service
import { CompaniesService } from '../../../services/companies.service';
// models
import { COMPANY } from '../../../models/company';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'mpw-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.sass']
})
export class SendEmailComponent implements OnInit {
  private company: COMPANY;
  public validationError: string;
  public validationDone: string;
  public inProgress: boolean;
  public currentUser: any;
  public currentUserSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public usersSelected: any,
    private companiesService: CompaniesService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private userService: UserService
  ) {
    this.companiesService.getSelectedCompanyStore().then(res => {
      this.company = res;
    });

    // Subscribe to the current user data observable
    this.currentUserSubscription = this.userService.getCurrentUserData().subscribe(data => {
      if (data !== null) {
        this.currentUser = data;
      }
    });
  }

  ngOnInit() {
    this.inProgress = false;
  }

  onSendEmail() {
    if (this.inProgress) {
      return;
    }
    this.inProgress = true;
    this.companiesService.sendInviteEmailToUser(this.company._id, this.usersSelected).subscribe(
      res => {
        this.validationError = '';
        if (this.usersSelected.length > 1) {
          localStorage.setItem('notificationMessage', this.translate.instant('emailsSending'));
        } else {
          localStorage.setItem('notificationMessage', this.translate.instant('emailSending'));
        }
        this.inProgress = false;
        this.closeDialog(this.usersSelected);
      },
      error => {
        this.inProgress = false;
        this.validationError = error.error.message;
      }
    );
  }

  sendTestMail(form) {
    const data = Object.assign(form.value, { lang: this.currentUser.lang });

    setTimeout(() => {
      this.companiesService.sendTestEmail(this.company._id, data).subscribe(
        res => {
          this.validationError = '';
          this.validationDone = this.translate.instant('emailSendingTest');
        },
        error => {
          this.validationError = this.translate.instant('invalidEmailAddress');
        }
      );
    }, 0);
  }

  closeDialog(data?) {
    if (this.inProgress) {
      return;
    }
    this.dialogRef.close(data);
  }
}
