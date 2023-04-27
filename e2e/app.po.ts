import {browser, by, element} from 'protractor';

export class MobilePracticeWebPage {
  navigateTo() {
    return browser.get('/');
  }

  getRouterOutlet() {
    return element(by.css('mpw-root router-outlet')).getText();
  }
}
