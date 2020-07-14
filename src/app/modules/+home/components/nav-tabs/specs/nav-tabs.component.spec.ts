import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavTabsComponent } from '../nav-tabs.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KeysPipe } from './../../../../../shared/pipes/keys.pipe';
import { GesdenService } from '../../../../../shared/services/gesden/gesden.service';
import { NavTabsService } from '../../../../../shared/services/nav-tabs/nav-tabs.service';
import { Users } from '../../../../../shared/models';

const NAV_TAB_LIST_MOCK = {
  PROCESO: {id: 1, name: 'HOME.COMPONENTS.NAV_TABS.PROCESS'},
  CONSULTA: {id: 2, name: 'HOME.COMPONENTS.NAV_TABS.REQUESTS'}
};

const mockUsersResponse: Users = {
  id: 'id',
  centers: [{id: 1, name: 'name'}, {id: 2, name: 'name'}, {id: 3, name: 'name 2'}],
  centerName: 'centerName',
  type: 1
};

describe('NavTabsComponent', () => {
  let component: NavTabsComponent;
  let fixture: ComponentFixture<NavTabsComponent>;
  let gesdenServiceStubSpy: jasmine.SpyObj<GesdenService>;
  let navTabsServiceStubSpy: jasmine.SpyObj<NavTabsService>;

  beforeEach(async(() => {
    const spyGesdenService = jasmine.createSpyObj('GesdenService', ['getCustomerId', 'getPatientId']);
    const spyNavTabsService = jasmine.createSpyObj('NavTabsService', ['activeNav']);
    TestBed.configureTestingModule({
      declarations: [NavTabsComponent, KeysPipe],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService,
        { provide: GesdenService, useValue: spyGesdenService },
        { provide: NavTabsService, useValue: spyNavTabsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    gesdenServiceStubSpy = TestBed.get(GesdenService);
    navTabsServiceStubSpy = TestBed.get(NavTabsService);
    navTabsServiceStubSpy.activeNav.and.callThrough();
    fixture = TestBed.createComponent(NavTabsComponent);
    component = fixture.componentInstance;
    component.user = mockUsersResponse;
    component.listSection = NAV_TAB_LIST_MOCK;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set active nav consulta if no customer or patient', () => {
      gesdenServiceStubSpy.getCustomerId.and.returnValue(null);
      gesdenServiceStubSpy.getPatientId.and.returnValue(null);
      component.ngOnInit();
      expect(component.activeNav).toEqual(2);
      expect(navTabsServiceStubSpy.activeNav).toHaveBeenCalledWith(2);
    });
  });

  describe('selection', () => {
    it('should set selected nav', () => {
      component.selection({value: {id: 1}});
      expect(navTabsServiceStubSpy.activeNav).toHaveBeenCalledWith(1);
      expect(component.activeNav).toEqual(1);
    });
  });
});
