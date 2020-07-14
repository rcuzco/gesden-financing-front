import { AuthResponse } from './../../models/auth/auth-response.model';
import { TokenService } from './../token/token.service';
import { ApiService } from './../api/api.service';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentService } from '..';
import { MOCKS } from '../../constants/tests';
import { SBCAuthService, SBCUser } from '@sbc/components';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthService', () => {

  const mockUser: SBCUser = {
    name: 'name',
  };

  const mockApiInstance = {
    params: { id: { value: 'value', key: 'key' } },
    path: 'testPath'
  };

  let service: AuthService;
  let tokenServiceStubSpy: jasmine.SpyObj<TokenService>;
  let apiServiceStubSpy: jasmine.SpyObj<ApiService>;
  let sbcAuthStubSpy: jasmine.SpyObj<SBCAuthService>;
  let routerStubSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spyTokenService = jasmine.createSpyObj('TokenService', ['removeToken', 'getToken', 'setToken']);
    const spyApiService = jasmine.createSpyObj('ApiService', ['getApiInstance', 'getApiUrl']);
    const spySBCAuthService = jasmine.createSpyObj('SBCAuthService', ['login', 'logOut', 'setConfig', 'token']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock },
        { provide: Router, useValue: spyRouter },
        { provide: SBCAuthService, useValue: spySBCAuthService },
        { provide: ApiService, useValue: spyApiService },
        { provide: TokenService, useValue: spyTokenService }
      ]
    }).compileComponents();
    service = TestBed.get(AuthService);
    apiServiceStubSpy = TestBed.get(ApiService);
    tokenServiceStubSpy = TestBed.get(TokenService);
    sbcAuthStubSpy = TestBed.get(SBCAuthService);
    routerStubSpy = TestBed.get(Router);
    routerStubSpy.navigate.and.callThrough();
    sbcAuthStubSpy.logOut.and.callThrough();
    sbcAuthStubSpy.setConfig.and.callThrough();
    apiServiceStubSpy.getApiInstance.and.returnValue(mockApiInstance);
    apiServiceStubSpy.getApiUrl.and.returnValue('apiUrl');
    tokenServiceStubSpy.getToken.and.returnValue('token');
    tokenServiceStubSpy.setToken.and.callThrough();
    tokenServiceStubSpy.removeToken.and.callThrough();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should call to SBC component auth in if correct response ', () => {
      sbcAuthStubSpy.login.and.returnValue(of(mockUser));
      service.login('user', 'password').subscribe();
      expect(sbcAuthStubSpy.login).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logged out', () => {
      service.logout();
      expect(sbcAuthStubSpy.logOut).toHaveBeenCalled();
      service.isLoggedOut$.subscribe(isLoggedOut => {
        expect(isLoggedOut).toBeTruthy();
      });
      expect(tokenServiceStubSpy.removeToken).toHaveBeenCalled();
    });
  });
});
