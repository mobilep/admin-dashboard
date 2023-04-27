import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// service
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'mpw-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit, OnDestroy {
  private jwt: string;
  public isAnimation: boolean;
  private subscribeUrl;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.isAnimation = false;
  }

  ngOnInit() {
    this.authService.clearUser();
    this.subscribeUrl = this.route.queryParams.subscribe(params => {
      if (params.jwt) {
        this.jwt = params.jwt;
        this.setJwt();
        this.cookieService.remove('accessToken');
        this.router.navigate(['/auth/change-password'], { queryParams: { jwt: this.jwt } });
      }
    });
  }

  ngOnDestroy() {
    this.subscribeUrl.unsubscribe();
  }

  setJwt() {
    this.authService.setAuthTokenToStorageReset(this.jwt);
  }

  onAnimation() {
    this.isAnimation = true;
    setTimeout(() => {
      this.isAnimation = false;
    }, 1000);
    this.router.navigate(['/auth/sign-in']);
  }
}
