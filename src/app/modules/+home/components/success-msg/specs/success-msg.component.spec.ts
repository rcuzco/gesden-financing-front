import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessMsgComponent } from '../success-msg.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UtilsService } from '../../../../../shared/services';
import { SBCLoadingService } from '@sbc/components';
import { FinancingService } from '../../../../../shared/services/financing/financing.service';
import { of } from 'rxjs';

describe('SuccessMsgComponent', () => {
  let component: SuccessMsgComponent;
  let fixture: ComponentFixture<SuccessMsgComponent>;
  let utilsServiceStubSpy: jasmine.SpyObj<UtilsService>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;
  let sBCLoadingServiceStubSpy: jasmine.SpyObj<SBCLoadingService>;

  beforeEach(async(() => {
    const spyUtilsService = jasmine.createSpyObj('UtilsService', ['openFile']);
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['getFinancingRequestsIDTermsPdf', 'getMandate']);
    const spySBCLoadingService = jasmine.createSpyObj('SBCLoadingService', ['show', 'hide']);
    TestBed.configureTestingModule({
      declarations: [ SuccessMsgComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: UtilsService, useValue: spyUtilsService},
        {provide: FinancingService, useValue: spyFinancingService},
        {provide: SBCLoadingService, useValue: spySBCLoadingService},
        TranslateService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    utilsServiceStubSpy = TestBed.get(UtilsService);
    financingServiceStubSpy = TestBed.get(FinancingService);
    sBCLoadingServiceStubSpy = TestBed.get(SBCLoadingService);
    utilsServiceStubSpy.openFile.and.callThrough();
    financingServiceStubSpy.getFinancingRequestsIDTermsPdf.and.returnValue(of(new Blob()));
    financingServiceStubSpy.getMandate.and.callThrough();
    sBCLoadingServiceStubSpy.show.and.callThrough();
    sBCLoadingServiceStubSpy.hide.and.callThrough();
    fixture = TestBed.createComponent(SuccessMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showPDF', () => {
    it('should open PDF ', () => {
      component.numberRequest = 40;
      spyOn(window, 'open');
      component.showPDF();
      expect(financingServiceStubSpy.getFinancingRequestsIDTermsPdf).toHaveBeenCalledWith(40);
    });
  });
});
