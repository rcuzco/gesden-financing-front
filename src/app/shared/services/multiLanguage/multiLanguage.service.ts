import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service of translation using ng2-translate.
 */
@Injectable({
  providedIn: 'root'
})
export class MultiLanguageService {
  public langSelected: string;
  private langDefault = 'es';
  private translateService: TranslateService;

  /**
   * Constructor: set default language
   */
  constructor(translateService: TranslateService) {
    this.translateService = translateService;
    this.translateService.setDefaultLang(this.langDefault);
  }

  /**
   * Initialize a language, first checks if has been setted in localStorage yet,
   * else set land by default.
   */
  public initialize(): string {
    if (this.langSelected) {
      return this.langSelected;
    }

    if (localStorage && localStorage['language']) {
      const lang = localStorage['language'];
      this.setLanguage(lang);
    } else {
      this.setLanguage(this.langDefault);
    }

    return this.langSelected;
  }

  /**
   * Get language selected
   */
  public getLanguage() {
    return this.langSelected;
  }

  /**
   * Set a language passed by param
   * @param language: string
   */
  public setLanguage(language: string) {
    if (localStorage) {
      localStorage['language'] = language;
    }
    this.langSelected = language;
    this.translateService.use(this.langSelected);
  }
}
