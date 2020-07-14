import { SessionService } from './../../../../../shared/services/session/session.service';
import { TestModuleMetadata, inject } from '@angular/core/testing';
import { setUpTestBed } from '../../../../../../test.common.spec';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

// Load the implementations that should be tested
import { HomeMainComponent } from '../home-main.component';
import { GesdenService } from './../../../../../shared/services/gesden/gesden.service';
import { UsersService } from './../../../../../shared/services/users/users.service';
import { EnvironmentService } from './../../../../../shared/services/environment/environment.service';
import { MOCKS } from '../../../../../shared/constants';
import { Users } from '../../../../../shared/models';
import { of, BehaviorSubject } from 'rxjs';
import { GESDENPARAMS } from '../../../../../shared/constants/gesden-params/gesden-params';
import { SBCLoadingService } from '@sbc/components';
import { NavTabsService } from '../../../../../shared/services/nav-tabs/nav-tabs.service';
import { ErrorModalService } from '../../../../../shared/services/errorModal/error-modal.service';
import { FinancingService } from '../../../../../shared/services/financing/financing.service';

const mockUsersResponse = {
  id: 'id',
  centers: [{id: 1, name: 'name'}, {id: 2, name: 'name'}],
  centerName: 'centerName',
  type: 1
};

class MockNavTabsService {
  public navListChange: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public activeNav(idNav) {
    this.navListChange.next(idNav);
  }
}

describe('Module Home -> Component HomeMain', () => {
  let component: HomeMainComponent;
  let fixture: ComponentFixture<HomeMainComponent>;
  let gesdenServiceStubSpy: jasmine.SpyObj<GesdenService>;
  let userServiceStubSpy: jasmine.SpyObj<UsersService>;
  let navTabsService: NavTabsService;
  let errorModalServiceStubSpy: jasmine.SpyObj<ErrorModalService>;


  beforeEach(() => {
    const spyGesdenService = jasmine.createSpyObj('GesdenService', ['getCustomerId', 'getPatientId', 'getCenterId']);
    const spyUsersService = jasmine.createSpyObj('UsersService', ['getUsers', 'getUsersID', 'setUserInfo']);
    const spyErrorModalService = jasmine.createSpyObj('ErrorModalService', ['hideModal']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        TranslateModule.forRoot()],
      declarations: [HomeMainComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: GesdenService, useValue: spyGesdenService },
        { provide: UsersService, useValue: spyUsersService },
        { provide: FinancingService, useValue: {requestToAddDoc: true} },
        SBCLoadingService,
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock },
        { provide: ErrorModalService, useValue: spyErrorModalService },
        NavTabsService
      ]
    }).compileComponents();
    gesdenServiceStubSpy = TestBed.get(GesdenService);
    userServiceStubSpy = TestBed.get(UsersService);
    navTabsService = TestBed.get(NavTabsService);
    errorModalServiceStubSpy = TestBed.get(ErrorModalService);
    errorModalServiceStubSpy.primerButton = {text: 'text', action: () => false};
    userServiceStubSpy.getUsers.and.returnValue(of(mockUsersResponse));
    userServiceStubSpy.getUsersID.and.returnValue(of(mockUsersResponse));
    userServiceStubSpy.setUserInfo.and.callThrough();
    gesdenServiceStubSpy.getCustomerId.and.returnValue('');
    gesdenServiceStubSpy.getCenterId.and.returnValue('centerId');
    gesdenServiceStubSpy.getPatientId.and.returnValue('');
    errorModalServiceStubSpy.hideModal.and.callThrough();
    fixture = TestBed.createComponent(HomeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngAfterViewInit', () => {
    it('should set activeProcess false and activeListRequest true if navListChange is CONSULTA', () => {
      navTabsService.activeNav(2);
      expect(component.activeProcess).toBeFalsy();
      expect(component.activeListRequest).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should set activeProcess true if customerId or patient id', () => {
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - 3);
      gesdenServiceStubSpy.getPatientId.and.returnValue('id');
      gesdenServiceStubSpy.getPatientId.and.returnValue('id');
      spyOn(component, 'getUsersData');
      component.ngOnInit();
      expect(component.getUsersData).toHaveBeenCalled();
    });
  });

  describe('getUsersData', () => {
    it('should call getUsers method if centerId', () => {
      gesdenServiceStubSpy.getCenterId.and.returnValue('centerId');
      userServiceStubSpy.getUsers.and.returnValue(of(mockUsersResponse));
      component.getUsersData();
      expect(component.nameCenter).toEqual('centerName');
      expect(userServiceStubSpy.setUserInfo).toHaveBeenCalled();
    });
    it('should call getUsersID method if no centerId', () => {
      gesdenServiceStubSpy.getCenterId.and.returnValue(null);
      userServiceStubSpy.getUsersID.and.returnValue(of(mockUsersResponse));
      component.getUsersData();
      expect(component.nameCenter).toEqual('centerName');
      expect(userServiceStubSpy.setUserInfo).toHaveBeenCalled();
    });
  });

});
