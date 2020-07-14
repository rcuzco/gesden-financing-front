import { SessionService } from './../../../../../shared/services/session/session.service';
import { FinancingService } from './../../../../../shared/services/financing/financing.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FractionationProcessComponent } from '../fractionation-process.component';
import { EnvironmentService } from '../../../../../shared/services';
import { MOCKS } from '../../../../../shared/constants';
import { FinancingRequest } from '../../../../../shared/models';
import { of } from 'rxjs';
import { GESDENPARAMS } from '../../../../../shared/constants/gesden-params/gesden-params';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { SBCLoadingService } from '@sbc/components';
import { KeysPipe } from '../../../../../shared/pipes';

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

describe('FractionationProcessComponent', () => {
  let component: FractionationProcessComponent;
  let fixture: ComponentFixture<FractionationProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ FractionationProcessComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [FinancingService,
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock }, DatePipe, SBCLoadingService, KeysPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FractionationProcessComponent);
    component = fixture.componentInstance;
  });

  it('should have a defined component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    fixture.detectChanges();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should getFinancingData true', inject([FinancingService], (financingService) => {
    spyOn(financingService, 'getRequestId').and.returnValue('');
    const response = <FinancingRequest>{};
    const spy = spyOn(financingService, 'financingRequestsPreview').and.returnValue(of(response));
    component.getFinancingData();
    expect(spy).toHaveBeenCalled();
    expect(component.financingData).toBe(response);
  }));

  it('should getFinancingData false', inject([FinancingService], (financingService) => {
    spyOn(financingService, 'getRequestId').and.returnValue('121212');
    const response = <FinancingRequest> mockFinancingData;
    const spy = spyOn(financingService, 'financingRequestsID').and.returnValue(of(response));
    component.getFinancingData();
    expect(spy).toHaveBeenCalledWith(financingService.getRequestId());
    expect(component.financingData).toBe(response);
  }));

  it('should checkViability false', inject([FinancingService], (financingService) => {
    const response = <FinancingRequest>{};
    response.id = 22;
    const spy = spyOn(financingService, 'financingRequests').and.returnValue(of(mockFinancingData));
    const spy2 = spyOn(financingService, 'setRequestId').and.callThrough();
    component.checkViability();
    expect(spy).toHaveBeenCalled();
    expect(component.financingData).toEqual(mockFinancingData);
    expect(spy2).toHaveBeenCalledWith('3');
  }));

  it('should getInfoAlert false', inject([FinancingService], (financingService) => {
    component.financingData = mockFinancingData;
    component.getInfoAlert({show: true, text: 'mensaje alerta'});
    expect(component.showAlert).toBe(true);
    expect(component.textAlert ).toBe('mensaje alerta');
  }));

  it('should saveBudgets true', inject([FinancingService], (financingService) => {
    component.financingData = mockFinancingData;
    const responseFinancingRequest = {
      budgets: [{id: 1, description: 'description1'}]
    };
    spyOn(financingService, 'getRequestId').and.returnValue('');
    const spyFinancingService = spyOn(financingService, 'financingRequestsIDTerms').and.returnValue(of(responseFinancingRequest));
    component.saveBudgets({});
    expect(spyFinancingService).toHaveBeenCalled();
    expect(component.financingData.financingRequestDetail).toEqual(responseFinancingRequest);
    expect(component.financingData.financingBudgetDetails).toEqual([{budget: 1, budgetName: 'description1'}]);
  }));

  describe('setFinancingStatus', () => {
    it('should set status variable', () => {
      component.financingData = mockFinancingData;
      spyOn(component, 'getStatusDescr');
      component.setFinancingStatus(1);
      expect(component.financingData.status).toEqual(1);
      expect(component.getStatusDescr).toHaveBeenCalled();
    });
  });

  describe('generateRequest', () => {
    it('should show success message', () => {
      spyOn(component, 'getStatusDescr');
      component.generateRequest(true);
      expect(component.showSuccessMsg).toBeTruthy();
      expect(component.getStatusDescr).toHaveBeenCalled();
    });
  });

});
