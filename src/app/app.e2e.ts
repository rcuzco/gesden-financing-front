import { browser, by, element } from 'protractor';
import 'tslib';

describe('App', () => {

  beforeEach(async () => {
    await browser.get('/');
  });

  it('should have <sas-shell>', async () => {
    const subject = await element(by.css('sas-shell')).isPresent();
    const result = true;
    expect(subject).toEqual(result);
  });

});
