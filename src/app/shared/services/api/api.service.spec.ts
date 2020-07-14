import { TestBed, inject } from '@angular/core/testing';
import { EnvironmentService } from '../environment';
import { UtilsService } from './../utils/utils.service';

import { ApiService } from './api.service';

import { API_CALL_URL, ApiCallUrl } from './';


describe('shared -> Api Service', () => {
  let apiService;
  let utilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        UtilsService
      ]
    });
    apiService = TestBed.get(ApiService);
    utilsService = TestBed.get(UtilsService);

  });

  it('Should be defined', () => {
    expect(apiService).toBeDefined();
  });

  it('getApiInstance should return instance of apiCallUrl', () => {
    const apiExpected = <ApiCallUrl>utilsService.copyDeepObject(API_CALL_URL.USERS);

    expect(apiService.getApiInstance(API_CALL_URL.USERS)).toEqual(apiExpected);
  });

  it('getApiUrl should return correct url with mock server without params', () => {
    const apiInstance = utilsService.copyDeepObject(API_CALL_URL.USERS);
    const contextUrl = 'http://localhost:3000';

    const url = apiService.getApiUrl(contextUrl, apiInstance);
    const urlExpected = 'http://localhost:3000/users';
    expect(url).toEqual(urlExpected);
  });

  it('getApiUrl should return correct url with mock server with params', () => {

    const API_CALL_URL_MOCK: ApiCallUrl = utilsService.copyDeepObject(API_CALL_URL.USERS_ID);
    API_CALL_URL_MOCK.params.id.value = 1;

    const apiInstance = apiService.getApiInstance(API_CALL_URL_MOCK);
    const contextUrl = 'http://localhost:3000';

    const url = apiService.getApiUrl(contextUrl, apiInstance);

    const urlExpected = 'http://localhost:3000/users/' + API_CALL_URL_MOCK.params.id.value;
    expect(url).toEqual(urlExpected);
  });

});
