import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SBCBreadcrumElement, SBCAuthService } from '@sbc/components';
import { of, Subject } from 'rxjs';
import { StateService, AuthService } from '../../../../shared/services';
import { MultiLanguageService } from '../../../../shared/services/multiLanguage';
// Load the implementations that should be tested
import { ShellMainComponent } from '../shell-main.component';
import { MOCKS } from './../../../../shared/constants/tests/mocks.constants';
import { ApiService } from './../../../../shared/services/api/api.service';
import { EnvironmentService } from './../../../../shared/services/environment/environment.service';
import { TokenService } from './../../../../shared/services/token/token.service';
import { UtilsService } from './../../../../shared/services/utils/utils.service';
import { GesdenService } from '../../../../shared/services/gesden/gesden.service';
import { FinancingService } from '../../../../shared/services/financing/financing.service';

let testResult = '';

const breadcrumElements: SBCBreadcrumElement[] = [
  {
    id: 'el1',
    text: 'el1',
    onClick: () => testResult = 'it works'
  },
  {
    id: 'el2',
    text: 'el2',
    onClick: () => testResult = 'it works'
  },
];

class RouterStub {
  public ne = new NavigationStart(0, 'http://localhost:4200/login');
  public events = of(this.ne);

  public navigate(path: string[]): void {
    return;
  }
}


describe('Module Shell -> Component ShellMainComponent', () => {

  let component: ShellMainComponent;
  let fixture: ComponentFixture<ShellMainComponent>;
  let router: Router;
  let gesdenServiceStubSpy: jasmine.SpyObj<GesdenService>;
  let authServiceStubSpy: jasmine.SpyObj<AuthService>;
  let sbcAuthServiceStubSpy: jasmine.SpyObj<SBCAuthService>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(async(() => {
    const spyGesdenService = jasmine.createSpyObj('GesdenService', ['setUserId', 'setCenterId', 'setPatientId', 'setCustomerId']);
    const spyAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    const spySBCAuthService = jasmine.createSpyObj('SBCAuthService', ['isTokenRefreshing$']);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        MultiLanguageService,
        ApiService,
        UtilsService,
        StateService,
        { provide: SBCAuthService, useValue: spySBCAuthService },
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock },
        { provide: FinancingService, useValue: {requestToAddDoc: true} },
        { provide: GesdenService, useValue: spyGesdenService },
        { provide: AuthService, useValue: spyAuthService },
        TokenService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ],
      declarations: [ShellMainComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents().then(() => {
      gesdenServiceStubSpy = TestBed.get(GesdenService);
      authServiceStubSpy = TestBed.get(AuthService);
      sbcAuthServiceStubSpy = TestBed.get(SBCAuthService);
      sbcAuthServiceStubSpy = TestBed.get(SBCAuthService);
      sbcAuthServiceStubSpy.isTokenRefreshing$ = new Subject<boolean>();
      gesdenServiceStubSpy.setUserId.and.callThrough();
      gesdenServiceStubSpy.setCenterId.and.callThrough();
      gesdenServiceStubSpy.setPatientId.and.callThrough();
      gesdenServiceStubSpy.setCustomerId.and.callThrough();
      authServiceStubSpy.getUser.and.callThrough();
      fixture = TestBed.createComponent(ShellMainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      router = TestBed.get(Router);
      testResult = '';
    });

  }));

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should getParamsGESDEN', () => {
    expect(component.getParamsGESDEN('sd'));
  });

  describe('ngOnInit', () => {
    it('should set url params', () => {
      spyOn(component, 'getParamsGESDEN');
      spyOnProperty(document, 'URL').and.returnValue('url?params');
      component.ngOnInit();
      expect(component.getParamsGESDEN).toHaveBeenCalledWith('params');
    });
  });

  describe('getParamsGESDEN', () => {
    it('should set user id param', () => {
      component.getParamsGESDEN('userId=1');
      expect(gesdenServiceStubSpy.setUserId).toHaveBeenCalledWith('1');
    });
    it('should set center id param', () => {
      component.getParamsGESDEN('centerId=1');
      expect(gesdenServiceStubSpy.setCenterId).toHaveBeenCalledWith('1');
    });
    it('should set patient id param', () => {
      component.getParamsGESDEN('patientId=1');
      expect(gesdenServiceStubSpy.setPatientId).toHaveBeenCalledWith('1');
    });
    it('should set customer id param', () => {
      component.getParamsGESDEN('customerId=1');
      expect(gesdenServiceStubSpy.setCustomerId).toHaveBeenCalledWith('1');
    });
  });



});
