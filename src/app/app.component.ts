import { Component, OnInit } from '@angular/core';
// service
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'mpw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  private userLoaded: boolean;
  private currentUserSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService,
    private angularFireAuth: AngularFireAuth
  ) {
    this.checkBrowserLanguage();
    this.userLoaded = false;

    // Subscribe to the current user data observable
    this.currentUserSubscription = this.userService.getCurrentUserData().subscribe(data => {
      if (data !== null) {
        this.userLoaded = true;
        this.currentUserSubscription.unsubscribe();
        this.angularFireAuth.auth.signInWithCustomToken(this.authService.getFirebaseAccessTokenFromStorage())
          .catch(error => console.error('Error: ', error));
      }
    });
  }

  ngOnInit() {
    console.log('%cVersion: 2.0.0', 'color: #1e9efb;');
  }

  get isActive() {
    if (this.userLoaded && this.authService.getAuthTokenFromStorage()) {
      return true;
    }
  }

  checkBrowserLanguage() {
    if (navigator.language && navigator.language !== '') {
      if (navigator.language === 'fr-FR' || navigator.language === 'fr') {
        this.translate.use('fr');
      } else {
        this.translate.use('en');
      }
    }
  }
}
