import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StepBarService } from './../../../../../shared/services/step-bar/step-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FeasibilityRequestComponent } from '../feasibility-request.component';
import { TranslateModule } from '@ngx-translate/core';
import { FinancingRequest } from '../../../../../shared/models';
import { of } from 'rxjs';

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
    tisCheck: true
  },
  financingBudgetDetails: true,
  financingRequestDetail: true
};

const statusMock = {
  REQUEST_KO: { id: 1, value: 'value' },
  REQUEST_OK: { id: 1, value: 'value' },
  REQUEST_INOK: { id: 1, value: 'value' },
  REQUEST_FINISH: { id: 1, value: 'value' },
  REQUEST_VALIDATE_DOC: { id: 1, value: 'value' },
  REQUEST_REVIEW_DOC: { id: 1, value: 'value' },
  REQUEST_APPROVED: { id: 1, value: 'value' }
};

describe('FeasibilityRequestComponent', () => {
  let component: FeasibilityRequestComponent;
  let fixture: ComponentFixture<FeasibilityRequestComponent>;
  let stepBarServiceStubSpy: jasmine.SpyObj<StepBarService>;

  beforeEach(async(() => {
    const spyStepBarService = jasmine.createSpyObj('StepBarService', ['nextStep']);

    TestBed.configureTestingModule({
      declarations: [FeasibilityRequestComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: StepBarService, useValue: spyStepBarService },
        TranslateService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
    stepBarServiceStubSpy = TestBed.get(StepBarService);
    stepBarServiceStubSpy.nextStep.and.callThrough();
    fixture = TestBed.createComponent(FeasibilityRequestComponent);
    component = fixture.componentInstance;
    component.financingData = mockFinancingData;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should do nothing if no changes in finaning data', () => {
      expect(component.ngOnChanges({})).toBeUndefined();
    });
    it('should set okStatus and openModal variable if not financialData id', () => {
      component.status = statusMock;
      component.financingData.id = null;
      component.ngOnChanges({
        financingData: {
          currentValue: 'current',
          previousValue: null,
          isFirstChange: null,
          firstChange: null
        }
      });
      expect(component.okStatus).toBeTruthy();
      expect(component.openModal).toBeTruthy();
    });
    it('should set okStatus and openModal variable if financialData id', () => {
      component.status = statusMock;
      component.financingData.id = 1;
      component.ngOnChanges({
        financingData: {
          currentValue: 'current',
          previousValue: null,
          isFirstChange: null,
          firstChange: null
        }
      });
      expect(component.okStatus).toBeTruthy();
      expect(component.openModal).not.toBeTruthy();
    });
  });

  describe('nextStep', () => {
    it('should call nextStep service method', () => {
      component.nextStep();
      expect(stepBarServiceStubSpy.nextStep).toHaveBeenCalled();
    });
  });

  describe('emitCheckViability', () => {
    it('should emit', () => {
      spyOn(component.checkViability, 'emit');
      component.emitCheckViability();
      expect(component.checkViability.emit).toHaveBeenCalled();
    });
  });

  describe('controlDisabled', () => {
    it('should set false if financing data ', () => {
      component.financingData = mockFinancingData;
      expect(component.controlDisabled()).toBeFalsy();
    });
    it('should set true if no financing data', () => {
      component.financingData = null;
      expect(component.controlDisabled()).toBeTruthy();
    });
  });

  describe('yesButton', () => {
    it('should set open modal to false', () => {
      component.yesButton.action();
      expect(component.openModal).toBeFalsy();
    });
  });

  describe('noButton', () => {
    it('should emit validate nif', () => {
      spyOn(component.validateNIF, 'emit');
      component.noButton.action();
      expect(component.validateNIF.emit).toHaveBeenCalled();
    });
  });
});
