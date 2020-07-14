import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBudgetsComponent } from '../list-budgets.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SBCLoadingService } from '@sbc/components';
import { Budget, Content } from '../../../../../shared/models/budgets';
import { BudgetService } from '../../../../../shared/services/budget/budget.service';
import { of } from 'rxjs';

const defaultContentMock: Content = {
  id: 1,
  description: 'description',
  status: 'status',
  date: 'data',
  amount: 5,
  checked: undefined
};

const mockBudget = [ defaultContentMock ];

describe('ListBudgetsComponent', () => {
  let component: ListBudgetsComponent;
  let fixture: ComponentFixture<ListBudgetsComponent>;
  let budgetServiceStubSpy: jasmine.SpyObj<BudgetService>;
  let sBCLoadingServiceStubSpy: jasmine.SpyObj<SBCLoadingService>;

  beforeEach(async(() => {
    const spyFinancingService = jasmine.createSpyObj('BudgetService', ['getBudgets']);
    const spySBCLoadingService = jasmine.createSpyObj('SBCLoadingService', ['hide', 'show']);
    TestBed.configureTestingModule({
      declarations: [ListBudgetsComponent],
      providers: [DatePipe, SBCLoadingService,
        {
          provide: BudgetService, useValue: spyFinancingService
        },
        {
          provide: SBCLoadingService, useValue: spySBCLoadingService
        }
      ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    budgetServiceStubSpy = TestBed.get(BudgetService);
    sBCLoadingServiceStubSpy = TestBed.get(SBCLoadingService);
    sBCLoadingServiceStubSpy.hide.and.callThrough();
    sBCLoadingServiceStubSpy.show.and.callThrough();
    budgetServiceStubSpy.getBudgets.and.returnValue(of(mockBudget));
    fixture = TestBed.createComponent(ListBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectBudget', () => {
    it('should set total amount and check true if event true', () => {
      spyOn(component.selectBudgets, 'emit');
      defaultContentMock.checked = false;
      component.selectBudget(null, defaultContentMock);
      expect(defaultContentMock.checked).toEqual(true);
      expect(component.totalAmount).toEqual(5);
      expect(component.selectBudgets.emit).toHaveBeenCalledWith({ totalAmount: 5, budgets: [] });
    });
    it('should set total amount and check false if event false', () => {
      spyOn(component.selectBudgets, 'emit');
      defaultContentMock.checked = true;
      component.selectBudget(null, defaultContentMock);
      expect(defaultContentMock.checked).toEqual(false);
      expect(component.totalAmount).toEqual(-5);
      expect(component.selectBudgets.emit).toHaveBeenCalledWith({ totalAmount: -5, budgets: [] });
    });
  });

  describe('ngOnChanges', () => {
    it('should get budgets if changes', () => {
      component.financingBudgetDetails = [];
      spyOn(component, 'setCheckedBudgets');
      component.ngOnChanges({
        filterDates: {
          currentValue: {
            value: 'value'
          },
          previousValue: null,
          firstChange: false,
          isFirstChange: null
        }
      });
      expect(component.budgets).toEqual(mockBudget);
      expect(component.setCheckedBudgets).toHaveBeenCalled();
      expect(sBCLoadingServiceStubSpy.show).toHaveBeenCalled();
      expect(sBCLoadingServiceStubSpy.hide).toHaveBeenCalled();
    });
  });

  describe('setCheckedBudgets', () => {
    it('should do nothing if no financingBudgetDetails', () => {
      component.financingBudgetDetails = [];
      expect(component.setCheckedBudgets()).toBeUndefined();
    });
    it('should do nothing if no financingBudgetDetails', () => {
      const content1: any = defaultContentMock;
      const content2: any = defaultContentMock;
      content2.budget = 1;
      content2.checked = true;
      component.budgets = [content1, content2];
      component.financingBudgetDetails = [content1, content2];
      component.setCheckedBudgets();
      expect(component.totalAmount).toEqual(20);
    });
  });
});

