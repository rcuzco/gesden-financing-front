import { FinancingRequest } from './../../models/financing-requests/financing-requests.model';
import { EnvironmentService } from './../environment/environment.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancingService } from './financing.service';
import { MOCKS } from '../../constants';
import { API_CALL_URL } from '../api/apiCallUrl.constants';
import { UtilsService, ApiService } from '..';
import { Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SessionService } from '../session';
import { GESDENPARAMS } from '../../constants/gesden-params/gesden-params';
import { AddDocumentationRequestParams, AddDocumentationRequestResponse } from '../../models';
describe('FinancingService', () => {

  const mockResponse: FinancingRequest = {
    id: 3,
    userId: '723723',
    status: 2,
    customer: {
      address: 'Madrid',
      docId: '322323',
      mail: 'prueba@gmail.com',
      firstName: 'Juan',
      lastName: 'Fernandez',
      docType: 'NIF',
      medicalRecordId: 'e23r23r',
      cardNumber: '222222'
    },
    patient: {
      address: 'Madrid',
      docId: '322323',
      mail: 'prueba@gmail.com',
      firstName: 'Juan',
      lastName: 'Fernandez',
      docType: 'NIF',
      medicalRecordId: 'e23r23r',
      cardNumber: '222222'
    },
    financingCheckDetail: {
      asnefCheck: true,
      tisCheck: false
    },
    financingBudgetDetails: true,
    financingRequestDetail: true
  };

  let service;
  let httpMock;
  let environment;
  let utilsService;
  let apiService;
  let httpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock },
        DatePipe,
        { provide: SessionService, useValue: { getItem: () => 'sessionItem', setItem: () => true } }
      ]
    });
    service = TestBed.get(FinancingService);
    httpMock = TestBed.get(HttpTestingController);
    environment = TestBed.get(EnvironmentService);
    utilsService = TestBed.get(UtilsService);
    apiService = TestBed.get(ApiService);
    httpClient = TestBed.get(HttpClient);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should financingRequestsPreview`, () => {
    const endpointRequest: string = environment.data.apiUrl + API_CALL_URL.FINANCING_REQUESTS_PREVIEW.path;
    const endpointApigee: string = environment.data.authToken;
    httpMock.match(endpointRequest);
    const servicio = service.financingRequestsPreview();
    expect(servicio instanceof Observable).toEqual(true);
    servicio.subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const mockReq = httpMock.expectOne({
      url: endpointApigee,
      method: 'GET'
    });
    httpMock.match(request => request.url.includes('health'));
    mockReq.flush(mockResponse);
    httpMock.verify();
  });

  it(`should financingRequestsID`, () => {
    const endpointRequest: string = environment.data.apiUrl + API_CALL_URL.FINANCING_REQUESTS_ID.path;
    const endpointApigee: string = environment.data.authToken;
    httpMock.match(endpointRequest);
    const servicio = service.financingRequestsID('2');
    expect(servicio instanceof Observable).toEqual(true);
    servicio.subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const mockReq = httpMock.expectOne({
      url: endpointApigee,
      method: 'GET'
    });
    httpMock.match(request => request.url.includes('health'));
    mockReq.flush(mockResponse);
    httpMock.verify();
  });

  it(`should financingRequests`, () => {
    const endpointRequest: string = environment.data.apiUrl + API_CALL_URL.FINANCING_REQUESTS.path;
    httpMock.match(endpointRequest);
    const servicio = service.financingRequests();
    expect(servicio instanceof Observable).toEqual(true);
    servicio.subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const mockReq = httpMock.expectOne({
      url: endpointRequest,
      method: 'POST',
      body: {
        'patientId': 232323,
        'customerId': 444444,
        'centerId': 232323,
        'userId': '1233'
      }
    });
    httpMock.match(request => request.url.includes('health'));
    mockReq.flush(mockResponse);
    httpMock.verify();
  });


  it(`should getFinancingRequests without filters`, () => {
    const endpointRequest: string = environment.data.apiUrl + API_CALL_URL.FINANCING_REQUESTS.path;
    const endpointApigee: string = environment.data.authToken;
    const dates = {
      dateFrom: new Date(),
      dateTo: new Date()
    };
    httpMock.match(endpointRequest);
    const servicio = service.getFinancingRequests(dates, 'page');
    expect(servicio instanceof Observable).toEqual(true);
    servicio.subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const mockReq = httpMock.expectOne({
      url: endpointApigee,
      method: 'GET'
    });
    httpMock.match(request => request.url.includes('health'));
    mockReq.flush(mockResponse);
    httpMock.verify();
  });

  it(`should getFinancingRequests with filters`, () => {
    const endpointRequest: string = environment.data.apiUrl + API_CALL_URL.FINANCING_REQUESTS.path;
    const endpointApigee: string = environment.data.authToken;
    const dates = {
      dateFrom: null,
      dateTo: null,
      center: 'center',
      status: 'status',
      numberHistory : 'memberHistory',
      numberRequest: 2
    };
    httpMock.match(endpointRequest);
    const servicio = service.getFinancingRequests(dates, 'page');
    expect(servicio instanceof Observable).toEqual(true);
    servicio.subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const mockReq = httpMock.expectOne({
      url: endpointApigee,
      method: 'GET'
    });
    httpMock.match(request => request.url.includes('health'));
    mockReq.flush(mockResponse);
    httpMock.verify();
  });

  it(`should financingIntervals`, () => {
    const endpointRequest: string = environment.data.apiUrl + API_CALL_URL.FINANCING_INTERVALS.path;
    const endpointApigee: string = environment.data.authToken;
    httpMock.match(endpointRequest);
    const servicio = service.financingIntervals();
    expect(servicio instanceof Observable).toEqual(true);
    servicio.subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const mockReq = httpMock.expectOne({
      url: endpointApigee,
      method: 'GET'
    });
    httpMock.match(request => request.url.includes('health'));
    mockReq.flush(mockResponse);
    httpMock.verify();
  });

  it(`should getRequestId 1`, () => {
    service.requestId = '2323';
    expect(service.getRequestId()).toBe('2323');
  });

  it(`should getRequestId 2`, () => {
    service.requestId = undefined;
    expect(service.getRequestId()).toBe('sessionItem');
  });

  it(`should setRequestId 1`, () => {
    service.setRequestId('22323');
    expect(service.requestId).toBe('22323');
  });

  it(`should setRequestId 2`, () => {
    service.setRequestId('');
    expect(service.requestId).toEqual('');
  });

  describe('financingRequestsIDTerms', () => {
    it('should parse body entry and http put', () => {
      spyOn(httpClient, 'put').and.returnValue(of('response'));
      service.financingRequestsIDTerms('id', 'budget').subscribe(res => {
        expect(res).toEqual('response');
      });
      expect(httpClient.put).toHaveBeenCalledWith('http://tests-base-url.com/financing-requests/id/terms', 'budget');
    });
  });

  describe('getFinancingRequestsIDTermsPdf', () => {
    it('should parse body entry and http get', () => {
      spyOn(httpClient, 'get').and.returnValue(of('response'));
      service.getFinancingRequestsIDTermsPdf('id', 'budget').subscribe(res => {
        expect(res).toEqual('response');
      });
      expect(httpClient.get).toHaveBeenCalledWith('http://tests-base-url.com/financing-requests/id/terms-pdf', { responseType: 'blob' });
    });
  });

  describe('sendRequestDocumentation', () => {
    it('should parse body entry and http get', (done: DoneFn) => {
      const ibanData: AddDocumentationRequestParams = {iban: '1', isIbanTitular: true, deleteDocument: true};
      const formData = new FormData();
      const response: AddDocumentationRequestResponse = {
        bankDocument: 'bankDocument',
        command: 'command',
        iban: 'iban',
        ibanTitular: true,
        nifClient: 'nifClient',
        requestAttachment: 'requestAttachment',
        nifPatient: 'nifPatient',
      };
      spyOn(httpClient, 'put').and.returnValue(of(response));
      service.sendRequestDocumentation('1', formData, ibanData).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });
      const headers = new HttpHeaders();
      const params = new HttpParams(
        {
          fromObject: {
            iban: ibanData.iban.toUpperCase(),
            isIbanTitular: ibanData.isIbanTitular.toString(),
            deleteDocument: ibanData.deleteDocument.toString()
          }
        }
      );
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      const options = { headers: headers, params: params };
      expect(httpClient.put).toHaveBeenCalledWith('http://tests-base-url.com/financing-requests/1/attachments', formData, options);
    });
  });

  describe('getAddDocRequest', () => {
    it('should return requestToAddDoc', () => {
      service.requestToAddDoc = mockResponse;
      expect(service.getAddDocRequest()).toEqual(mockResponse);
    });
  });

  describe('getDocument', () => {
    it('should get document by id', () => {
      spyOn(httpClient, 'get').and.returnValue(of('response'));
      spyOn(apiService, 'getApiUrl').and.returnValue('apiURL');
      service.getDocument('id', 'name').subscribe(() => {
        expect(httpClient.get).toHaveBeenCalledWith('apiURL', {responseType: 'blob', observe: 'response'});
      });
    });
  });

  describe('setDocumentationStatus', () => {
    it('should set documentation by id', () => {
      spyOn(httpClient, 'put').and.returnValue(of('response'));
      spyOn(apiService, 'getApiUrl').and.returnValue('apiURL');
      service.setDocumentationStatus('id', 'data').subscribe(() => {
        expect(httpClient.put).toHaveBeenCalledWith('apiURL', 'data');
      });
    });
  });

  describe('getFinancingRequestExcel', () => {
    it('should request excel with filters', () => {
      spyOn(httpClient, 'get').and.returnValue(of('response'));
      const filter = {
        center: '1',
        dateFrom: new Date('2015-03-29'),
        dateTo: new Date('2015-03-29'),
        status: 'status',
        numberHistory: '1',
        numberRequest: '1'
      };
      let queryParameters = new HttpParams();
      queryParameters = queryParameters.set(GESDENPARAMS.CENTERID.value, filter.center);
      queryParameters = queryParameters.set('dateOfCreationFrom', '2015-03-29');
      queryParameters = queryParameters.set('dateOfCreationTo', '2015-03-29');
      queryParameters = queryParameters.set('requestStatus', filter.status);
      queryParameters = queryParameters.set('medicalRecordId', filter.numberHistory);
      queryParameters = queryParameters.set('id', filter.numberRequest);
      queryParameters = queryParameters.set('sort', 'creationDate');
      const options = {
        params: queryParameters
      };
      service.getFinancingRequestExcel(filter);
      expect(httpClient.get).toHaveBeenCalledWith('http://tests-base-url.com/financing-requests/getExcel', options);

    });
    it('should request excel with filters', () => {
      spyOn(httpClient, 'get').and.returnValue(of('response'));
      const filter = {};
      let queryParameters = new HttpParams();
      queryParameters = queryParameters.set(GESDENPARAMS.CENTERID.value, '');
      queryParameters = queryParameters.set('dateOfCreationFrom', null);
      queryParameters = queryParameters.set('dateOfCreationTo', null);
      queryParameters = queryParameters.set('requestStatus', '');
      queryParameters = queryParameters.set('medicalRecordId', '');
      queryParameters = queryParameters.set('id', '');
      queryParameters = queryParameters.set('sort', 'creationDate');
      const options = {
        params: queryParameters
      };
      service.getFinancingRequestExcel(filter);
      expect(httpClient.get).toHaveBeenCalledWith('http://tests-base-url.com/financing-requests/getExcel', options);
    });
  });
});
