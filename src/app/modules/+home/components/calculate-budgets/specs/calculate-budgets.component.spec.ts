import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CalculateBudgetsComponent } from '../calculate-budgets.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FinancingService } from '../../../../../shared/services/financing/financing.service';
import { of } from 'rxjs';
import { FinancingRequest } from '../../../../../shared/models';
import { SBCInputSelectModule } from '@sbc/components';
import { By } from '@angular/platform-browser';
import { UtilsService } from '../../../../../shared/services';
import { BudgetService } from '../../../../../shared/services/budget/budget.service';

describe('CalculateBudgetsComponent', () => {
  let component: CalculateBudgetsComponent;
  let fixture: ComponentFixture<CalculateBudgetsComponent>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;

  beforeEach(async(() => {
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['financingIntervals']);
    TestBed.configureTestingModule({
      declarations: [CalculateBudgetsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: FinancingService, useValue: spyFinancingService,
      },
      { provide: BudgetService, useValue: {fractionateBudget: () => '30.00'}},
        TranslateService, UtilsService],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, SBCInputSelectModule]
    })
      .compileComponents();
    financingServiceStubSpy = TestBed.get(FinancingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateBudgetsComponent);
    financingServiceStubSpy.financingIntervals.and.returnValue(of(null));
    component = fixture.componentInstance;
    component.months = [{ value: '2', text: 'text' }];
    component.totalAmount = 2;
    component.amountFrac = '2';
    component.valoresPresupuesto = { minAmount: 1, intervals: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set form, emitValues when month changes and disable form if totalAmount < valoresPresupuesto.minAmount', () => {
      spyOn(component, 'emitValuesCalculate');
      component.totalAmount = 1;
      component.valoresPresupuesto = { minAmount: 2 };
      component.financingRequestDetail = { amount: 2 };
      component.ngOnInit();
      expect(component.calculateForm.get('slider').value).toEqual(1);
      expect(component.calculateForm.get('inputSlider').value).toEqual(1);
    });
  });

  describe('ngOnChanges', () => {
    it('should push new month to component.months if financingRequestDetail current value', () => {
      component.months = [];
      component.ngOnChanges({
        financingRequestDetail: {
          currentValue: { months: 2 },
          previousValue: null,
          firstChange: null,
          isFirstChange: null
        }
      });
      expect(component.months).toEqual([{ value: '2', text: '2HOME.COMPONENTS.CALCULATE_BUDGETS.MONTH' }]);
    });
    it('should push 6 months to component.months if totalAmount current value && < valoresPresupuesto.minAmount and set form if form exists and emitvalues', () => {
      spyOn(component, 'emitValuesCalculate');
      component.months = [];
      component.valoresPresupuesto = { minAmount: 2 };
      component.ngOnChanges({
        totalAmount: {
          currentValue: 1,
          previousValue: null,
          firstChange: null,
          isFirstChange: null
        }
      });
      expect(component.calculateForm.get('inputSlider').value).toEqual(1);
      expect(component.calculateForm.get('slider').value).toEqual(1);
      expect(component.emitValuesCalculate).toHaveBeenCalled();
    });
    it('should searchIntervals if totalAmount current value && > valoresPresupuesto.minAmount and set form if form exists and emitvalues', () => {
      spyOn(component, 'emitValuesCalculate');
      spyOn(component, 'searchIntervals');
      component.months = [];
      component.valoresPresupuesto = { minAmount: 2 };
      component.ngOnChanges({
        totalAmount: {
          currentValue: 3,
          previousValue: null,
          firstChange: null,
          isFirstChange: null
        }
      });
      expect(component.searchIntervals).toHaveBeenCalled();
      expect(component.emitValuesCalculate).toHaveBeenCalled();
    });
  });

  describe('searchIntervals', () => {
    it('should set interval if is range', () => {
      component.valoresPresupuesto = {
        intervals: [
          {
            maxAmount: 3,
            minAmount: 1,
            months: [2]
          },
          {
            maxAmount: 1,
            minAmount: 0
          },
          {
            maxAmount: 4,
            minAmount: 3
          }
        ]
      };
      component.searchIntervals(2);
      expect(component.months).toEqual([{ value: '2', text: '2HOME.COMPONENTS.CALCULATE_BUDGETS.MONTH' }]);
      // should not push any month if not in range
      component.months = [];
      component.searchIntervals(6);
      expect(component.months).toEqual([]);
    });
  });

  describe('checkMaxAmount', () => {
    it('should do nothing if not checked', () => {
      expect(component.checkMaxAmount({ target: { checked: false } })).toBeUndefined();
    });
    it('should set form values if checked', () => {
      component.totalAmount = 9;
      component.checkMaxAmount({ target: { checked: true } });
      expect(component.calculateForm.get('slider').value).toEqual(9);
      expect(component.calculateForm.get('inputSlider').value).toEqual(9);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should emit when input slide', () => {
      const slider = fixture.debugElement.query(By.css('#slider'));
      const sliderElement = slider.nativeElement;
      spyOn(component, 'emitValuesCalculate');
      spyOn(component, 'searchIntervals');
      sliderElement.value = '1';
      sliderElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.emitValuesCalculate).toHaveBeenCalled();
      expect(component.searchIntervals).toHaveBeenCalledWith('1');
      expect(component.calculateForm.get('inputSlider').value).toEqual('1');
    });
    it('should emit when inputSlider keyup', fakeAsync(() => {
      const slider = fixture.debugElement.query(By.css('#name'));
      const sliderElement = slider.nativeElement;
      component.financingRequestDetail = {
        months: 1,
        amount: 5
      };
      spyOn(component, 'emitValuesCalculate');
      spyOn(component, 'searchIntervals');
      sliderElement.value = '1';
      sliderElement.dispatchEvent(new Event('keyup'));
      tick(505);
      fixture.detectChanges();
      expect(component.emitValuesCalculate).toHaveBeenCalled();
      expect(component.searchIntervals).toHaveBeenCalledWith('1');
      expect(component.calculateForm.get('slider').value).toEqual(1);
    }));
  });

  describe('setInitialForm', () => {
    it('should set 6 monnth if no month', () => {
      component.months = [];
      component.setInitialForm();
      expect(component.months).toEqual([{ value: '6', text: '6HOME.COMPONENTS.CALCULATE_BUDGETS.MONTH' }]);
    });
    it('should set data form financing request', () => {
      component.financingRequestDetail = {
        months: 1,
        amount: 5
      };
      component.setInitialForm();
      expect(component.calculateForm.value).toEqual({
        month: '1',
        slider: 5,
        inputSlider: 5,
        checkMax: false
      });
    });
  });

  describe('emitValuesCalculate', () => {
    it('should set amountfrac to 0 if no value slider', () => {
      spyOn(component.calculateValues, 'emit').and.callThrough();
      component.setInitialForm();
      component.calculateForm.controls.slider.setValue(null);
      component.emitValuesCalculate();
      expect(component.amountFrac).toEqual(null);
    });
    it('should calculate if slider is 0', () => {
      spyOn(component.calculateValues, 'emit').and.callThrough();
      component.setInitialForm();
      component.calculateForm.controls.slider.setValue(0);
      component.emitValuesCalculate();
      expect(component.amountFrac).toEqual('30.00');
    });
  });
});
