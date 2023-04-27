import { Component, OnInit } from '@angular/core';
// vendor
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
// service
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'mpw-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.sass']
})
export class EditPasswordComponent implements OnInit {
  public passwordType: string;
  public labelPassword: string;
  public disabledForm: boolean;
  public validationError: string;

  constructor(private authService: AuthService, public dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit() {
    this.passwordType = 'password';
    this.disabledForm = true;
    this.labelPassword = this.translate.instant('show');
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

  onSubmit(userPassword) {
    if (userPassword['valid']) {
      this.authService.changePassword(userPassword['value']).subscribe(
        () => {
          this.closeDialog();
          localStorage.setItem('notificationMessage', this.translate.instant('passwordUpdated'));
        },
        error => {
          this.validationError = error.error.message;
        }
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
