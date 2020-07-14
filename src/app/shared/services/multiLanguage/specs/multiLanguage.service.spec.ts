import { TestBed, inject } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  TranslateParser,
  TranslateFakeLoader
} from '@ngx-translate/core';

import { MultiLanguageService } from '../multiLanguage.service';

describe('shared -> MultiLanguageService', () => {
  let multiLanguageService: MultiLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultiLanguageService,
        TranslateService,
        TranslateLoader,
        TranslateParser
      ],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })]
    });

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    spyOn(TranslateService.prototype, 'setDefaultLang');
    spyOn(TranslateService.prototype, 'use');

    multiLanguageService = TestBed.get(MultiLanguageService);
  });

  it('Should be defined', () => {
    expect(multiLanguageService).toBeDefined();
  });

  it('getLanguage should return undefined', () => {
    expect(multiLanguageService.getLanguage()).toBe(undefined);
  });


  it('setLanguage to "es" and getLanguage should return "es"', () => {
    localStorage.clear();
    multiLanguageService.setLanguage('es');
    expect(multiLanguageService.langSelected).toBe('es');
  });

  it('initialize should return "es" ', () => {
    localStorage.clear();
    multiLanguageService.setLanguage('es');

    multiLanguageService.initialize();
    expect(multiLanguageService.langSelected).toBe('es');
  });

  it('initialize should return "es" ', () => {
    localStorage.clear();

    multiLanguageService.initialize();
    expect(multiLanguageService.langSelected).toBe('es');
  });

  it('initialize should return defaultLang ', () => {
    localStorage.clear();
    multiLanguageService.initialize();
    expect(multiLanguageService.langSelected).toBe('es');
  });

  it('set language with localStorage emtpy return lang "en" ', () => {
    localStorage.clear();
    multiLanguageService.setLanguage('en');
    expect(multiLanguageService.langSelected).toBe('en');
  });
});
