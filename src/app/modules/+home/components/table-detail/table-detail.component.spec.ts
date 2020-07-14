import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDetailComponent } from './table-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersService } from '../../../../shared/services/users/users.service';
import { FormsModule } from '@angular/forms';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

const mockUsersResponse = {
  id: 'id',
  centers: [{ id: 1, name: 'name' }, { id: 2, name: 'name' }, { id: 3, name: 'name 2' }],
  centerName: 'centerName',
  type: 1
};

const mockFinancingData = {
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
    asnefCheck: false,
    tisCheck: true,
    tisCheckDate: '2020-02-03T17:06:09Z'
  },
  financingBudgetDetails: true,
  financingRequestDetail: {
    amount: 555,
    months: 12,
    monthlyPayment: 43
  }
};


describe('TableDetailComponent', () => {
  let component: TableDetailComponent;
  let fixture: ComponentFixture<TableDetailComponent>;
  let usersServiceStubSpy: jasmine.SpyObj<UsersService>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;

  beforeEach(async(() => {
    const spyUsersService = jasmine.createSpyObj('UsersService', ['getUserInfo']);
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['setDocumentationStatus', 'getDocument']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [
        { provide: UsersService, useValue: spyUsersService },
        { provide: FinancingService, useValue: spyFinancingService }
      ],
      declarations: [TableDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    usersServiceStubSpy = TestBed.get(UsersService);
    usersServiceStubSpy.getUserInfo.and.returnValue(mockUsersResponse);
    financingServiceStubSpy = TestBed.get(FinancingService);
    financingServiceStubSpy.setDocumentationStatus.and.returnValue(of(true));
    financingServiceStubSpy.getDocument.and.returnValue(of(new HttpResponse()));
    fixture = TestBed.createComponent(TableDetailComponent);
    component = fixture.componentInstance;
    component.request = mockFinancingData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setButtons', () => {
    it('should do nothing if not a valid status', () => {
      mockFinancingData.status = 999;
      component.request = mockFinancingData;
      expect(component.setButtons()).toBeUndefined();
    });
    it('should set buttons if clinic and status 2', () => {
      spyOn(component, 'openAddDoc');
      mockFinancingData.status = 2;
      component.request = mockFinancingData;
      component.isFinancing = false;
      component.setButtons();
      component.buttons[0].action();
      expect(component.openAddDoc).toHaveBeenCalled();
    });
    it('should set buttons if financing and status 2', () => {
      mockFinancingData.status = 2;
      component.request = mockFinancingData;
      component.isFinancing = true;
      component.setButtons();
      expect(component.buttons).toEqual([]);
    });
    it('should set buttons if financing and status 3', () => {
      spyOn(component, 'setStatus');
      mockFinancingData.status = 3;
      component.request = mockFinancingData;
      component.isFinancing = true;
      component.setButtons();
      component.buttons[0].action();
      expect(component.setStatus).toHaveBeenCalled();
      component.buttons[1].action();
      expect(component.setStatus).toHaveBeenCalled();
      component.buttons[2].action();
      expect(component.setStatus).toHaveBeenCalled();
    });
  });

  describe('openAddDoc', () => {
    it('should emit request', () => {
      component.request = mockFinancingData;
      spyOn(component.onOpenAddDoc, 'emit');
      component.openAddDoc();
      expect(component.onOpenAddDoc.emit).toHaveBeenCalledWith(mockFinancingData);
    });
  });

  describe('setStatus', () => {
    it('should return if compulsoryReason and no reason', () => {
      component.reason = '';
      expect(component.setStatus(1, true)).toBeUndefined();
    });
    it('should set status', () => {
      spyOn(component.onSendDocValidation, 'emit');
      component.user = mockUsersResponse;
      component.reason = 'reason';
      component.setStatus(1, true);
      expect(component.onSendDocValidation.emit).toHaveBeenCalled();
    });
  });
});
