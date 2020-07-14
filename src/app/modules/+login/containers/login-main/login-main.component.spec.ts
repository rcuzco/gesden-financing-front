import { AuthResponse } from './../../../../shared/models/auth/auth-response.model';
import { ROUTES_CONSTANTS } from './../../../../shared/constants/routes/routes.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestModuleMetadata, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { setUpTestBed } from './../../../../../test.common.spec';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SBCLoadingModule, SBCNotificationsModule, SBCUser, SBCAuthService } from '@sbc/components';
import { of, throwError } from 'rxjs';
import { MOCKS } from '../../../../shared/constants/tests';
import { AuthService, EnvironmentService } from '../../../../shared/services';
import { ApiService } from './../../../../shared/services/api/api.service';
import { LoggerService } from './../../../../shared/services/logger/logger.service';
import { TokenService } from './../../../../shared/services/token/token.service';
import { UtilsService } from './../../../../shared/services/utils/utils.service';
import { LoginMainComponent } from './login-main.component';
import { SessionService } from '../../../../shared/services/session';


describe('LoginMainComponent', () => {
  let component: LoginMainComponent;
  let fixture: ComponentFixture<LoginMainComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  class MockUtilsFunctions {
    enumToArray() {
      return;
    }
  }
  const spyAuthService = jasmine.createSpyObj('AuthService', ['login', 'logout']);

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateModule.forRoot(),
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([{
        path: '',
        component: LoginMainComponent
      },
      { path: ROUTES_CONSTANTS.HOME.path, component: LoginMainComponent }
      ]),
      SBCLoadingModule,
      SBCNotificationsModule,
    ],
    declarations: [LoginMainComponent],
    providers: [
      {provide: AuthService, useValue: spyAuthService},
      ApiService,
      LoggerService,
      UtilsService,
      TokenService,
      SessionService,
      { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  setUpTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMainComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    authService.logout.and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service on login', () => {
    authService.login.and.returnValue(of({} as SBCUser));
    component.login({ username: 'username', password: 'password' });
    expect(authService.login).toHaveBeenCalled();
  });


  describe('#login', () => {


    it('should log an error and hide loader if authService cannot provide user', () => {
      authService.login.and.returnValue(throwError({ status: 'TEST ERROR' }));
      const spy = spyOn(component['loader'], 'show');
      component.login({ username: 'ABC', password: 'DEF' });
      expect(component.backendLoginErrors).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });
  });

});
