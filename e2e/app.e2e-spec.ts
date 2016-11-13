import { SkyrimPage } from './app.po';

describe('skyrim App', function() {
  let page: SkyrimPage;

  beforeEach(() => {
    page = new SkyrimPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
