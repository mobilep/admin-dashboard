import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// service
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'mpw-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {
  public validationError: string;

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.authService.clearUser();
  }

  onSubmit(forgotPassForm) {
    if (forgotPassForm.valid) {
      this.authService.sendResetEmail(forgotPassForm.value).subscribe(
        () => {
          localStorage.setItem(
            'notificationMessage',
            this.translate.instant('pleaseCheckYourEmail')
          );
          this.authService.logOut();
        },
        error => {
          this.validationError = error.error.message;
        }
      );
    }
  }
}
