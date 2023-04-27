import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

// service
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'mpw-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {
  public validationError: string;
  public passwordType: string;
  public labelPassword: string;
  public notificationMessage: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    public toasts: ToastrService,
    private translate: TranslateService,
  ) {
    this.getMessages();
  }

  ngOnInit() {
    this.labelPassword = this.translate.instant('show');
    this.passwordType = 'password';
    setTimeout(() => {
      this.notificationMessage = '';
      localStorage.removeItem('notificationMessage');
    }, 5000);

    this.authService.logOut();
  }

  getMessages() {
    this.notificationMessage = localStorage.getItem('notificationMessage');
    if (this.notificationMessage) {
      this.show(this.notificationMessage);
    }
  }

  show(text) {
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }

  checkUserLanguage(user) {
    if (user.lang && user.lang !== '') {
      this.translate.use(user.lang);
    }
  }

  onSubmit(loginForm) {
    if (loginForm.valid) {
      loginForm.controls['webForm'].setValue(true);
      this.authService.signIn(loginForm.value).subscribe(
        data => {
          this.authService.setAuthTokenToStorage(data.accessToken);
          this.authService.setFirebaseAccessTokenToStorage(data.fbtoken);
          this.userService.setLoggedUserData(data);
          this.checkUserLanguage(data);
          this.router.navigate(['/companies']);
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
