import { Ng2048WorkshopPage } from './app.po';

describe('ng2048-workshop App', () => {
  let page: Ng2048WorkshopPage;

  beforeEach(() => {
    page = new Ng2048WorkshopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
