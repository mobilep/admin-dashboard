import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// service
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mpw-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public passwordType: string;
  public labelPassword: string;
  public validationError: string;
  private sub: any;

  constructor(private authService: AuthService, private translate: TranslateService, private route: ActivatedRoute) {
    this.passwordType = 'password';
    this.labelPassword = this.translate.instant('show');
  }

  ngOnInit() {
    this.authService.clearUser();
    this.sub = this.route.queryParams.subscribe(params => {
      if (params && params.jwt) {
        this.authService.setAuthTokenToStorageReset(params.jwt);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(newPassForm) {
    if (newPassForm.valid) {
      this.authService.resetPass(newPassForm.value).subscribe(
        res => {
          localStorage.setItem('notificationMessage', this.translate.instant('passwordUpdated'));
          this.authService.logOut();
        },
        error => {
          this.validationError = error.error.message;
        }
      );
    }
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
}
