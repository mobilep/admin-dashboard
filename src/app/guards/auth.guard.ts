import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate() {
    if (this.cookieService.get('accessToken')) {
      return true;
    }

    this.router.navigate(['auth/sign-in']);
    return false;
  }
}
