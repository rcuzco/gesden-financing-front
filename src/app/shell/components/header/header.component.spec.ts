import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '../../../shared/pipes';
import { NavTabsService } from '../../../shared/services/nav-tabs/nav-tabs.service';
import { AuthService } from '../../../shared/services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let navTabsServiceStubSpy: jasmine.SpyObj<NavTabsService>;
  let authServiceStubSpy: jasmine.SpyObj<AuthService>;
  let routerStubSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    const spyNavTabsService = jasmine.createSpyObj('NavTabsService', ['activeNav']);
    const spyAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [HeaderComponent, KeysPipe],
      providers: [DatePipe,
        { provide: NavTabsService, useValue: spyNavTabsService },
        { provide: AuthService, useValue: spyAuthService },
        { provide: Router, useValue: spyRouter }
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    navTabsServiceStubSpy = TestBed.get(NavTabsService);
    authServiceStubSpy = TestBed.get(AuthService);
    routerStubSpy = TestBed.get(Router);
    navTabsServiceStubSpy.activeNav.and.callThrough();
    authServiceStubSpy.logout.and.callThrough();
    routerStubSpy.navigate.and.callThrough();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selection', () => {
    it('should set active nav', () => {
      component.selection({ value: { id: 1 } });
      expect(component.activeNav).toEqual(1);
      expect(navTabsServiceStubSpy.activeNav).toHaveBeenCalledWith(1);
    });
  });

  describe('actioTooltip', () => {
    it('should toogle tooltip var', () => {
      component.tooltip = false;
      component.actionTooltip();
      expect(component.tooltip).toBeTruthy();
    });
  });

  describe('actionMobileMenu', () => {
    it('should toogle mobileMenu var', () => {
      component.mobileMenu = false;
      component.actionMobileMenu();
      expect(component.mobileMenu).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should call authservice logout', () => {
      component.logout();
      expect(authServiceStubSpy.logout).toHaveBeenCalled();
      expect(component.tooltip).toBeFalsy();
    });
  });
});
