import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SBCLoadingModule, SBCModalModule, SBCNotificationsModule, SBCInputCalendarModule, SBCAuthModule, SBCAuthService, SBCAuthConf } from '@sbc/components';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';
import { ApiService, MultiLanguageService, StateService, TokenService, UtilsService } from './shared/services';
import { EnvironmentService } from './shared/services/environment';
import { LoggerService } from './shared/services/logger/logger.service';
import { RestInterceptor } from './shared/services/rest/rest.interceptor';
import { SharedModule } from './shared/shared.module';
import { ShellMainComponent, ShellModule } from './shell';
import { DatePipe, registerLocaleData  } from '@angular/common';
registerLocaleData(es);


/* AOT configuration */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/* to load config */
export function initConfig(config: EnvironmentService) {
  return () => config.loadConfig();
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ShellMainComponent],
  /**
   * Import Angular's modules.
   */
  imports: [
    ShellModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SBCNotificationsModule,
    SBCModalModule,
    SBCInputCalendarModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SBCLoadingModule,
    SBCAuthModule.forRoot(),
    SharedModule
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestInterceptor,
      multi: true
    },
    MultiLanguageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [EnvironmentService],
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-ES'
    },
  /*  {
      provide: ErrorHandler,
      useClass: ErrorHandlerInterceptor
  },*/
    ApiService,
    EnvironmentService,
    TokenService,
    LoggerService,
    UtilsService,
    StateService,
    DatePipe
  ]
})
export class AppModule {

}
