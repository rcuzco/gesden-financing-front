import { MOCKS } from './../../constants/tests/mocks.constants';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BudgetService } from './budget.service';
import { EnvironmentService } from '../environment/environment.service';
import { UtilsService, ApiService } from '..';
import { DatePipe  } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Content } from '../../models';
import { of } from 'rxjs';

const defaultContentMock: Content = {
  id: 1,
  description: 'description',
  status: 'status',
  date: 'data',
  amount: 5,
  checked: undefined
};

describe('BudgetService', () => {
  let service: BudgetService;
  let httpClientStubSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock },
        { provide: HttpClient, useValue: spyHttpClient },
        DatePipe],
    });
    service = TestBed.get(BudgetService);
    httpClientStubSpy = TestBed.get(HttpClient);
    httpClientStubSpy.get.and.returnValue(of([defaultContentMock]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBudgets', () => {
    it('should return budgets', () => {
      service.getBudgets({dateTo: new Date('2015-03-03'), dateFrom: new Date('2015-03-03')}).subscribe(res => {
        expect(res).toEqual([defaultContentMock]);
      });
      expect(httpClientStubSpy.get).toHaveBeenCalled();
    });
  });

  describe('getFinancingIntervals', () => {
    it('should return financing intervals', () => {
      service.getFinancingIntervals().subscribe(res => {
        expect(res).toEqual( {
          'minAmount': 500,
          'maxAmount': 5000,
          'intervals': [
            {
              'minAmount': 300,
              'maxAmount': 2000,
              'months': [6, 12]
            },
            {
              'minAmount': 600,
              'maxAmount': 7000,
              'months': [12, 18, 24]
            }
          ]
        });
      });
    });
  });

  describe('fractionateBudget' , () => {
    it('should fractionate a budget by months', () => {
      expect(service.fractionateBudget(100, 5)).toEqual('20.00');
    });
  });
});
