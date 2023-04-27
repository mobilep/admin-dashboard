import {MobilePracticeWebPage} from './app.po';

describe('mobile-practice-web App', () => {
  let page: MobilePracticeWebPage;

  beforeEach(() => {
    page = new MobilePracticeWebPage();
  });

  it('should have router-outlet', () => {
    page.navigateTo();
    expect(page.getRouterOutlet());
  });
});
