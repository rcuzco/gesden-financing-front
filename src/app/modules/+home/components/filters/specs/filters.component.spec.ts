import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from '../filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NavTabsService } from '../../../../../shared/services/nav-tabs/nav-tabs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SBCInputCalendarModule, SBCInputSelectModule, SBCInputSelectMultipleModule, SBCSearchFilterModule } from '@sbc/components';
import { BehaviorSubject, of } from 'rxjs';
import { UsersService } from '../../../../../shared/services/users/users.service';
import { FinancingService } from '../../../../../shared/services/financing/financing.service';
import { UtilsService } from '../../../../../shared/services';

const subjectMock = new BehaviorSubject<any>(undefined);
const mockNavTabsService = {
  selectedDate: subjectMock.asObservable()
};

const mockUsersResponse = {
  id: 'id',
  centers: [{id: 1, name: 'name'}, {id: 2, name: 'name'}, {id: 3, name: 'name 2'}],
  centerName: 'centerName',
  type: 1
};

describe('FiltersComponent', () => {
  let navTabsServiceStubSpy: jasmine.SpyObj<NavTabsService>;
  let userServiceStubSpy: jasmine.SpyObj<UsersService>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;
  let utilsServiceStubSpy: jasmine.SpyObj<UtilsService>;
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(async(() => {
    const spyNavTabsService = jasmine.createSpyObj('NavTabsService', ['navListChange', 'activeNav']);
    const spyUsersService = jasmine.createSpyObj('UsersService', ['getUserInfo']);
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['getFinancingRequestExcel']);
    const spyUtilsService = jasmine.createSpyObj('UtilsService', ['openExcel']);
    TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [FormBuilder,
        {provide: NavTabsService, useValue: spyNavTabsService},
        {provide: UsersService, useValue: spyUsersService},
        {provide: FinancingService, useValue: spyFinancingService},
        {provide: UtilsService, useValue: spyUtilsService}
      ],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, RouterTestingModule, SBCInputSelectMultipleModule, SBCInputCalendarModule, SBCInputSelectModule, SBCSearchFilterModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    navTabsServiceStubSpy = TestBed.get(NavTabsService);
    userServiceStubSpy = TestBed.get(UsersService);
    financingServiceStubSpy = TestBed.get(FinancingService);
    utilsServiceStubSpy = TestBed.get(UtilsService);
    userServiceStubSpy.getUserInfo.and.returnValue(mockUsersResponse);
    navTabsServiceStubSpy.navListChange = new BehaviorSubject<any>(null);
    financingServiceStubSpy.getFinancingRequestExcel.and.returnValue(of(new Blob()));
    navTabsServiceStubSpy.activeNav.and.callFake((id) => navTabsServiceStubSpy.navListChange.next(id));
    utilsServiceStubSpy.openExcel.and.callThrough();
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    component.dates = {
      dateFrom: new Date('2015-03-25'),
      dateTo: new Date('2015-03-25')
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    navTabsServiceStubSpy.activeNav(2);
  });

  describe('showFilters', () => {
    it('should togle openFilters and scroll window', () => {
      spyOn(window, 'scrollTo').and.callThrough();
      component.openFilters = true;
      component.showFilters();
      expect(component.openFilters).toBeFalsy();
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  });

  describe('closeFilters', () => {
    it('should set openFilters to false', () => {
      component.closeFilters();
      expect(component.openFilters).toBeFalsy();
    });
  });

  describe('onSubmit', () => {
    it('should set open filters to false and emit filter', () => {
      mockUsersResponse.type = 1;
      userServiceStubSpy.getUserInfo.and.returnValue(mockUsersResponse);
      component.filterForm.controls['status'].setValue('statusTest');
      spyOn(component.filter, 'emit');
      component.onSubmit();
      expect(component.openFilters).toBeFalsy();
      expect(component.filter.emit).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should set sort asc if financing amd set value set selected centers and selected status' , () => {
      mockUsersResponse.type = 2;
      component.selectedCenters = [1, 2];
      component.selectedStatus = [1];
      component.numberHistory = 111;
      component.numberRequest = 222;
      userServiceStubSpy.getUserInfo.and.returnValue(mockUsersResponse);
      component.ngOnInit();
      expect(component.filterForm.value).toEqual({
        dateFrom: new Date('2015-03-25'),
        dateTo: new Date('2015-03-25'),
        numberHistory: 111,
        numberRequest: 222,
        status: [1],
        center: [1, 2],
        sort: 'asc'
      });
    });
  });

  describe('filterCenters', () => {
    it('should set centers to initial centers if no query', () => {
      component.selectedCenters = [1, 2, 3];
      component.ngOnInit();
      component.filterCenters('');
      expect(component.filterForm.value.center).toEqual([1, 2, 3]);
    });
    it('should return undefined if query is not an string and set options as an empty array', () => {
      expect(component.filterCenters(true)).toBeUndefined();
      expect(component.filteredOptions).toEqual([]);
    });
    it('should return undefined if query is < 3 and set options as an empty array', () => {
      expect(component.filterCenters('1')).toBeUndefined();
      expect(component.filteredOptions).toEqual([]);
    });
    it('should filter and set options', () => {
      component.centers = [{id: 1, name: 'name'}, {id: 2, name: 'name 2'}];
      component.filterCenters('name 2');
      expect(component.filteredOptions).toEqual([{value: 2, text: 'name 2'}]);
    });
  });

  describe('downloadExcel', () => {
    it('should fetch and open excel', () => {
      mockUsersResponse.type = 2;
      component.selectedCenters = [1, 2];
      component.selectedStatus = [1];
      component.numberHistory = 111;
      component.numberRequest = 222;
      userServiceStubSpy.getUserInfo.and.returnValue(mockUsersResponse);
      component.ngOnInit();
      const formValue = {
        dateFrom: new Date('2015-03-25'),
        dateTo: new Date('2015-03-25'),
        numberHistory: 111,
        numberRequest: 222,
        status: [1],
        center: [1, 2],
        sort: 'asc'
      };
      component.downloadExcel();
      expect(financingServiceStubSpy.getFinancingRequestExcel).toHaveBeenCalledWith(formValue);
      expect(utilsServiceStubSpy.openExcel).toHaveBeenCalledWith(new Blob(), 'solicitudes.xls');
    });
  });
});
