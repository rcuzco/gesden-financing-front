import { browser, by, element } from 'protractor';
import 'tslib';

describe('App', () => {

  beforeEach(async () => {
    await browser.get('/demo');
  });

  it('should have <sas-demo-main>', async () => {
    const subject = await element(by.css('sas-demo-main')).isPresent();
    const result = true;
    expect(subject).toEqual(result);
  });

});
