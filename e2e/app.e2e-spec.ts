import { TolePickoutPage } from './app.po';

describe('tole-pickout App', () => {
  let page: TolePickoutPage;

  beforeEach(() => {
    page = new TolePickoutPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
