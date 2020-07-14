import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SBCModalModule, SBCModalService } from '@sbc/components';
import { StateService } from '../../state';
import { TokenService } from './../../token/token.service';
import { RestInterceptor } from './../rest.interceptor';
import { ErrorModalService } from '../../errorModal/error-modal.service';
import { TranslateService } from '@ngx-translate/core';


describe(`AuthHttpInterceptor`, () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let stateService: StateService;
  let modalService: SBCModalService;
  let errorModalService: jasmine.SpyObj<ErrorModalService>;
  let translateServiceStubSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const spyErrorModalService = jasmine.createSpyObj('ErrorModalService', ['showModal', 'errorTextModal', 'setErrorRoute']);
    const spyTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SBCModalModule
      ],
      providers: [
        StateService,
        SBCModalService,
        { provide: ErrorModalService, useValue: spyErrorModalService },
        { provide: TranslateService, useValue: spyTranslateService },
        HttpClient,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RestInterceptor,
          multi: true,
        },
        TokenService
      ],
    });

    translateServiceStubSpy = TestBed.get(TranslateService);
    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
    stateService = TestBed.get(StateService);
    modalService = TestBed.get(SBCModalService);
    errorModalService = TestBed.get(ErrorModalService);
    errorModalService.showModal.and.callThrough();
    errorModalService.errorTextModal.and.callThrough();
    errorModalService.setErrorRoute.and.callThrough();
    translateServiceStubSpy.instant.and.returnValue('translation');
  });


  it('should not add an Authorization header', () => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue(null);

    http.get(fakeUrl).subscribe(response => {
      expect(fakeUrl).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`${fakeUrl}`);
    httpMock.verify();

  });


  it('should add an Authorization header', () => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue('hola');

    http.get(fakeUrl).subscribe(response => {
      expect(fakeUrl).toBeTruthy();

    });

    const httpRequest = httpMock.expectOne(`${fakeUrl}`);
    httpMock.verify();

  });

  it('should show modal 401 unauthorized', () => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue('hola');
    spyOn(SBCModalService.prototype, 'openModal');

    const mockErrorResponse = { status: 401, statusText: 'UNAUTHORIZED_ERROR', error: { message: 'message' } };
    stateService.setLoginErrorModalId('2');
    http.get(fakeUrl).subscribe(response => {}, error => {
      expect(error.statusText).toEqual('UNAUTHORIZED_ERROR');
    });

    httpMock.expectOne(`${fakeUrl}`).flush('', mockErrorResponse);
    httpMock.verify();

  });

  it('should not show modal 401 unauthorized', () => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue('hola');
    const mockErrorResponse = { status: 401, statusText: 'UNAUTHORIZED_ERROR' };

    http.get(fakeUrl).subscribe(response => {}, error => {
      expect(error.statusText).toEqual('UNAUTHORIZED_ERROR');
    });

    httpMock.expectOne(`${fakeUrl}`).flush('', mockErrorResponse);
    httpMock.verify();

  });
  it('should throw error1', () => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue('hola');
    const mockErrorResponse = { status: 400, statusText: 'GENERIC ERROR' };

    http.get(fakeUrl).subscribe(response => {
    }, error => {
      expect(error.statusText).toEqual('GENERIC ERROR');
    });

    httpMock.expectOne(`${fakeUrl}`).flush('', mockErrorResponse);
    httpMock.verify();

  });

});
