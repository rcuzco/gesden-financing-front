import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetSelectionComponent } from '../budget-selection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StepBarService } from '../../../../../shared/services/step-bar/step-bar.service';
import { FinancingService } from '../../../../../shared/services/financing/financing.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../../shared/services';
import { FinancingRequest } from '../../../../../shared/models';
import { emit } from 'cluster';
import { DatePipe } from '@angular/common';
import { BudgetService } from '../../../../../shared/services/budget/budget.service';

const mockFinancingData: FinancingRequest = {
  id: 3,
  userId: '723723',
  status: 2,
  customer: {
    address: 'Madrid',
    docId: '322323',
    mail: 'prueba@gmail.com',
    firstName: 'Juan',
    lastName: 'Fernandez',
    docType: '1',
    medicalRecordId: 'e23r23r',
    cardNumber: '222222'
  },
  patient: {
    address: 'Madrid',
    docId: '322323',
    mail: 'prueba@gmail.com',
    firstName: 'Juan',
    lastName: 'Fernandez',
    docType: '1',
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

describe('BudgetSelectionComponent', () => {
  let component: BudgetSelectionComponent;
  let fixture: ComponentFixture<BudgetSelectionComponent>;
  let stepBarServiceStubSpy: jasmine.SpyObj<StepBarService>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;
  let translateServiceStubSpy: jasmine.SpyObj<TranslateService>;
  let datePipeStubSpy: jasmine.SpyObj<DatePipe>;

  beforeEach(async(() => {
    const spyStepBarService = jasmine.createSpyObj('StepBarService', ['nextStep']);
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['financingIntervals']);
    const spyTranslateService = jasmine.createSpyObj('TranslateService', ['instant', 'get']);
    const spyDatePipe = jasmine.createSpyObj('DatePipe', ['transform']);

    TestBed.configureTestingModule({
      declarations: [BudgetSelectionComponent],
      providers: [
        { provide: StepBarService, useValue: spyStepBarService },
        { provide: FinancingService, useValue: spyFinancingService },
        { provide: TranslateService, useValue: spyTranslateService },
        { provide: DatePipe, useValue: spyDatePipe },
        UtilsService,
        { provide: BudgetService, useValue: {fractionateBudget: () => '30.00'}}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    stepBarServiceStubSpy = TestBed.get(StepBarService);
    financingServiceStubSpy = TestBed.get(FinancingService);
    translateServiceStubSpy = TestBed.get(TranslateService);
    datePipeStubSpy = TestBed.get(DatePipe);
    stepBarServiceStubSpy.nextStep.and.callThrough();
    financingServiceStubSpy.financingIntervals.and.returnValue(of(mockFinancingData));
    translateServiceStubSpy.instant.and.returnValue('instantTranslation');
    translateServiceStubSpy.get.and.returnValue(of('getTranslation'));
    datePipeStubSpy.transform.and.returnValue('parsedDate');
    fixture = TestBed.createComponent(BudgetSelectionComponent);
    component = fixture.componentInstance;
    component.financingData = mockFinancingData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('yesButton action', () => {
    it('should execute saveBudgets method', () => {
      spyOn(component, 'saveBudgets');
      component.yesButton.action();
      expect(component.saveBudgets).toHaveBeenCalled();
    });
  });

  describe('noButton action', () => {
    it('should set openModal false', () => {
      component.noButton.action();
      expect(component.openModal).toBeFalsy();
    });
  });

  describe('filter', () => {
    it('should set filterDates', () => {
      component.filter({ dateFrom: new Date('2015-03-03'), dateTo: new Date('2015-03-03') });
      expect(component.filterDates).toEqual({ dateFrom: new Date('2015-03-03'), dateTo: new Date('2015-03-03') });
    });
  });

  describe('getSelectBudget', () => {
    it('should return checked budget and set totalAmount', () => {
      const values = {
        totalAmount: 1,
        budgets: [
          { id: 1, description: 'description1', checked: false },
          { id: 2, description: 'description2', checked: true }
        ]
      };
      component.getSelectBudget(values);
      expect(component.totalAmount).toEqual(1);
      expect(component.budgets).toEqual([{ id: '2', description: 'description2' }]);
    });
  });

  describe('getCalculateValues', () => {
    it('should set amount and months', () => {
      component.getCalculateValues({ amount: 1, month: 1 });
      expect(component.amount).toEqual(1);
      expect(component.months).toEqual(1);
    });
    it('should validate form', () => {
      component.valoresPresupuesto = {
        minAmount: 5,
        maxAmount : 10
      };
      component.totalAmount = 100;
      component.getCalculateValues({amount: 7, month: 1});
      expect(component.validForm).toBeTruthy();
    });
  });

  describe('saveBudgets', () => {
    it('should emit budgets', () => {
      spyOn(component.sendBudgets, 'emit');
      component.filterDates = { dateFrom: new Date('2015-03-03'), dateTo: new Date('2015-03-03') };
      component.budgets = [{ id: '2', description: 'description2' }];
      component.amount = 100;
      component.months = 2;
      component.saveBudgets();
      expect(component.sendBudgets.emit).toHaveBeenCalledWith({
        budgets: [{ id: '2', description: 'description2' }],
        amount: '100',
        months: 2,
        monthlyPayment: '30.00',
        dateFrom: 'parsedDate',
        dateTo: 'parsedDate'
      });
    });
  });

  describe('nextButton', () => {
    it('should return undefined if form not valid', () => {
      component.validForm = false;
      expect(component.nextButton()).toBeUndefined();
    });
    it('should return undefined and call stepService nextStep if financingData budgets', () => {
      component.validForm = true;
      component.nextButton();
      expect(stepBarServiceStubSpy.nextStep).toHaveBeenCalledWith(3);
    });
    it('should openModal financing request is not ok', () => {
      component.validForm = true;
      const mockFinancingDataNoBudget = Object.assign({}, mockFinancingData);
      component.financingData = mockFinancingDataNoBudget;
      component.financingData.status = 1;
      component.nextButton();
      expect(component.openModal).toBeTruthy();
    });
    it('should saveBudgets if amount is in range', () => {
      component.validForm = true;
      const mockFinancingDataNoBudget = Object.assign({}, mockFinancingData);
      component.financingData = mockFinancingDataNoBudget;
      component.financingData.status = 1;
      component.valoresPresupuesto = {
        minAmount: 5,
        maxAmount : 10
      };
      component.amount = 9;
      spyOn(component, 'saveBudgets');
      component.nextButton();
      expect(component.saveBudgets).toHaveBeenCalled();
    });
  });

  describe('backStep', () => {
    it('should call stepService nextStep method', () => {
      component.backStep();
      expect(stepBarServiceStubSpy.nextStep).toHaveBeenCalledWith(1);
    });
  });

  describe('setRequestBudgets', () => {
    it('sset budget to request', () => {
      component.budgets = [{id: 1, description: 'description'}];
      component.setRequestBudgets();
      expect(component.financingData.financingBudgetDetails).toEqual([{budget: 1, budgetName: 'description'}]);
    });
  });

  describe('setValidForm', () => {
    it('should set valid form', () => {
      component.valoresPresupuesto = {
        minAmount: 5,
        maxAmount : 10
      };
      component.months = 1;
      component.amount = 7;
      component.totalAmount = 9;
      component.setValidForm();
      expect(component.validForm).toBeTruthy();
      expect(component.showAlertAmount).toBeFalsy();
    });
  });

  describe('resetRequestCalculateBudgets', () => {
    it('should set saved request and delete current request', () => {
      component.financingData.financingRequestDetail = {id: 1};
      component.resetRequestCalculateBudgets();
      expect(component.requestSaved).toEqual({id: 1});
    });
  });

  describe('getInitialDates', () => {
    it('should set form dates', () => {
      component.financingData.financingRequestDetail = {
        dateFrom: '2015-03-03',
        dateTo: '2015-03-03',
      };
      expect(component.getInitialDates()).toEqual({
        dateFrom: new Date('2015-03-03'),
        dateTo:  new Date('2015-03-03')
      });
    });
  });
});
