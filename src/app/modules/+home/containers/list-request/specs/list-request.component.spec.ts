import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestComponent } from '../list-request.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FinancingService } from '../../../../../shared/services/financing/financing.service';
import { of } from 'rxjs';
import { SBCLoadingService } from '@sbc/components';
import { UsersService } from '../../../../../shared/services/users/users.service';
import { FinancingRequest, Users } from '../../../../../shared/models';
import { UtilsService } from '../../../../../shared/services';

const mockUserInfo: Users = {
  centers: [{id: 1, name: 'name'}, {id: 2, name: 'name'}],
  id: 'id',
  centerName: 'centerName',
  type: 1
};

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

const mockPagination = {
  actualPage: 1,
  totalItems: 20,
  itemsPerPage: 5
};

const mockFilter = { dateFrom: new Date('2015-03-03'), dateTo: new Date('2015-03-03') };
const mockBlob = new Blob([{ size: 2, type: 'application/pdf', byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }]);

describe('ListRequestComponent', () => {
  let component: ListRequestComponent;
  let fixture: ComponentFixture<ListRequestComponent>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;
  let usersServiceStubSpy: jasmine.SpyObj<UsersService>;
  let utilsServiceStubSpy: jasmine.SpyObj<UtilsService>;
  let sBCLoadingServiceStubSpy: jasmine.SpyObj<SBCLoadingService>;


  beforeEach(async(() => {
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['getFinancingRequests', 'getFinancingRequestsIDTermsPdf']);
    const spyUsersService = jasmine.createSpyObj('UsersService', ['getUserInfo']);
    const spySBCLoadingService = jasmine.createSpyObj('SBCLoadingService', ['show', 'hide']);
    const spyUtilsService = jasmine.createSpyObj('UtilsService', ['openFile']);

    TestBed.configureTestingModule({
      declarations: [ListRequestComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: FinancingService, useValue: spyFinancingService },
        { provide: SBCLoadingService, useValue: spySBCLoadingService },
        { provide: UtilsService, useValue: spyUtilsService },
        { provide: UsersService, useValue: spyUsersService },
        TranslateService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    financingServiceStubSpy = TestBed.get(FinancingService);
    usersServiceStubSpy = TestBed.get(UsersService);
    sBCLoadingServiceStubSpy = TestBed.get(SBCLoadingService);
    utilsServiceStubSpy = TestBed.get(UtilsService);
    fixture = TestBed.createComponent(ListRequestComponent);
    financingServiceStubSpy.getFinancingRequests.and.returnValue(of(mockFinancingData));
    financingServiceStubSpy.getFinancingRequestsIDTermsPdf.and.returnValue(of(mockBlob));
    sBCLoadingServiceStubSpy.show.and.callThrough();
    sBCLoadingServiceStubSpy.hide.and.callThrough();
    usersServiceStubSpy.getUserInfo.and.returnValue(mockUserInfo);
    utilsServiceStubSpy.openFile.and.callThrough();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create (ngOnInit)', () => {
    expect(component).toBeTruthy();
  });

  describe('filter', () => {
    it('should call getFinancingRequests and set requests', () => {
      spyOn(component, 'getFinancingRequests');
      component.filter(mockFilter);
      expect(component.getFinancingRequests).toHaveBeenCalledWith(mockFilter, 0);
    });
  });

  describe('display active page ', () => {
    it('should call getFinancingRequests and set active page', () => {
      component.paginationInfo = mockPagination;
      spyOn(component, 'getFinancingRequests');
      component.filterValues = mockFilter;
      component.displayActivePage(1);
      expect(component.getFinancingRequests).toHaveBeenCalledWith(mockFilter, 0);
    });
  });

  describe('showPDF', () => {
    it('should get pdf and open in new window', () => {
      spyOn(window, 'open');
      component.showPDF('id');
      expect(financingServiceStubSpy.getFinancingRequestsIDTermsPdf).toHaveBeenCalledWith('id');
      expect(sBCLoadingServiceStubSpy.show).toHaveBeenCalled();
      expect(sBCLoadingServiceStubSpy.hide).toHaveBeenCalled();
      expect(utilsServiceStubSpy.openFile).toHaveBeenCalledWith(mockBlob, 'idHOME.CONTAINERS.LIST_REQUEST.TABLE.PDF_REQUEST', 'pdf');
    });
  });

  describe('getFinancingRequests', () => {
    it('should get and set requests', () => {
      spyOn(component, 'resolveStatus');
      component.getFinancingRequests(mockFilter, 1);
      expect(financingServiceStubSpy.getFinancingRequests).toHaveBeenCalledWith(mockFilter, 1);
      expect(sBCLoadingServiceStubSpy.show).toHaveBeenCalled();
      expect(sBCLoadingServiceStubSpy.hide).toHaveBeenCalled();
      expect(component.resolveStatus).toHaveBeenCalled();
    });
  });

  describe('setDeniedType', () => {
    it('should set tis if tisCheck', () => {
      expect(component.setDeniedType({tisCheck: false})).toEqual('_TIS');
    });
    it('should set asnef if asnefCheck', () => {
      expect(component.setDeniedType({asnefCheck: false, tisCheck: true})).toEqual('_ASNEF');
    });
  });

  describe('resolveStatus', () => {
    it('should set status and medicalRecordId for each element', () => {
      const elements: any = [
        {patient: {medicalRecordId: 'id'}, status: 0},
        {patient: {medicalRecordId: 'id'}, status: 1},
        {patient: {medicalRecordId: 'id'}, status: 2},
        {patient: {medicalRecordId: 'id'}, status: 3},
        {patient: {medicalRecordId: 'id'}, status: 4},
        {patient: {medicalRecordId: 'id'}, status: 5},
        {patient: {medicalRecordId: 'id'}, status: 6}
      ];
      component.resolveStatus(elements);
      expect(elements).toEqual([
        {patient: {medicalRecordId: 'id'}, status: 0, medicalRecordId: 'id', statusDescr: 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_KO', statusClass: 'sol-ko'},
        {patient: {medicalRecordId: 'id'}, status: 1, medicalRecordId: 'id', statusDescr: 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_INOK', statusClass: 'sol-inko'},
        {patient: {medicalRecordId: 'id'}, status: 2, medicalRecordId: 'id', statusDescr: 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_OK', statusClass: 'sol-inprogress'},
        {patient: {medicalRecordId: 'id'}, status: 3, medicalRecordId: 'id', statusDescr: 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_VALIDATE_DOC', statusClass: 'sol-inprogress'},
        {patient: {medicalRecordId: 'id'}, status: 4, medicalRecordId: 'id', statusDescr: 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_REVIEW_DOC', statusClass: 'sol-inprogress'},
        {patient: {medicalRecordId: 'id'}, status: 5, medicalRecordId: 'id', statusDescr: 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_APPROVED', statusClass: 'sol-ok'},
        {patient: {medicalRecordId: 'id'}, status: 6, medicalRecordId: 'id'}
      ]);
    });
  });

  describe('showDetail', () => {
    it('should do nothing if not allowed status' , () => {
      spyOn(component, 'allowShowDetail').and.returnValue(false);
      expect(component.showDetail(0, 1)).toBeUndefined();
    });
    it('should set item selected' , () => {
      component.itemSelect = [true];
      spyOn(component, 'allowShowDetail').and.returnValue(true);
      component.showDetail(0, 1);
      expect(component.itemSelect).toEqual([false]);
    });
  });

  describe('allowShowDetail', () => {
    it('should return undefined if not financing allowed status', () => {
      mockUserInfo.type = 2;
      usersServiceStubSpy.getUserInfo.and.returnValue(mockUserInfo);
      component.ngOnInit();
      expect(component.allowShowDetail(8)).toBeUndefined();
    });
    it('should return undefined if not clinic allowed status', () => {
      mockUserInfo.type = 1;
      usersServiceStubSpy.getUserInfo.and.returnValue(mockUserInfo);
      component.ngOnInit();
      expect(component.allowShowDetail(0)).toBeTruthy();
    });
    it('should return true if allowed', () => {
      mockUserInfo.type = 1;
      usersServiceStubSpy.getUserInfo.and.returnValue(mockUserInfo);
      component.ngOnInit();
      expect(component.allowShowDetail(2)).toBeTruthy();
    });
  });

  describe('hasRequestPDF', () => {
    it('should return false if not pdfStatus', () => {
      expect(component.hasRequestPDF(0)).toBeFalsy();
    });
    it('should return true if pdfStatus', () => {
      expect(component.hasRequestPDF(2)).toBeTruthy();
    });
  });

  describe('trackRequests', () => {
    it('should return index', () => {
      expect(component.trackRequests(1)).toEqual(1);
    });
  });
});
