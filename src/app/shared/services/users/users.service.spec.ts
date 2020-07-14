import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UsersService } from './users.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from '../api';
import { GesdenService } from '../gesden/gesden.service';
import { EnvironmentService } from '../environment';

const mockApiInstance = {
  params: {id: {value: 'value', key: 'key'}},
  path: 'testPath'
};
const mockEnvironmentService = {
  data: {
    apiUrl: 'apiUrl',
    contexts: {
      APIS: 'APIS'
    }
  }
};
const mockUsersResponse = {
  id: 'id',
  centers: [{id: 1, name: 'name'}, {id: 2, name: 'name'}],
  centerName: 'centerName',
  type: 1
};

describe('UsersService', () => {
  let httpClientStubSpy: jasmine.SpyObj<HttpClient>;
  let gesdenServiceStubSpy: jasmine.SpyObj<GesdenService>;
  let apiServiceStubSpy: jasmine.SpyObj<ApiService>;
  let service: UsersService;

  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    const spyGesdenService = jasmine.createSpyObj('GesdenService', ['getUserId', 'getCenterId']);
    const spyApiService = jasmine.createSpyObj('ApiService', ['getApiInstance', 'getApiUrl']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpClient, useValue: spyHttpClient },
        { provide: ApiService, useValue: spyApiService },
        { provide: GesdenService, useValue: spyGesdenService },
        { provide: EnvironmentService, useValue: mockEnvironmentService }
      ]
    });
    httpClientStubSpy = TestBed.get(HttpClient);
    gesdenServiceStubSpy = TestBed.get(GesdenService);
    apiServiceStubSpy = TestBed.get(ApiService);
    httpClientStubSpy.get.and.returnValue(of(mockUsersResponse));
    gesdenServiceStubSpy.getUserId.and.returnValue('userId');
    gesdenServiceStubSpy.getCenterId.and.returnValue('centerId');
    apiServiceStubSpy.getApiInstance.and.returnValue(mockApiInstance);
    apiServiceStubSpy.getApiUrl.and.returnValue('getApiUrl');
    service = TestBed.get(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsersID', () => {
    it ('should fetch users id', () => {
      service.getUsersID().subscribe(res => expect(res).toEqual(mockUsersResponse));
      expect(apiServiceStubSpy.getApiInstance).toHaveBeenCalled();
      expect(gesdenServiceStubSpy.getUserId).toHaveBeenCalled();
      expect(apiServiceStubSpy.getApiUrl).toHaveBeenCalledWith( 'apiUrlAPIS', { params: { id: { value: 'userId', key: 'key' }}, path: 'testPath' });
      expect(httpClientStubSpy.get).toHaveBeenCalledWith('getApiUrl');
    });
  });

  describe('getUsers', () => {
    it ('should fetch users', () => {
      service.getUsers().subscribe(res => expect(res).toEqual(mockUsersResponse));
      expect(gesdenServiceStubSpy.getUserId).toHaveBeenCalled();
      expect(gesdenServiceStubSpy.getCenterId).toHaveBeenCalled();
      expect(httpClientStubSpy.get).toHaveBeenCalled();
    });
  });

  describe('setUserInfo & getUserInfo', () => {
    it('should set and get user info', () => {
      service.setUserInfo(mockUsersResponse);
      expect(service.getUserInfo()).toEqual(mockUsersResponse);
    });
  });
});
