import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { takeUntil, debounceTime, map } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';
import { SBCSelectOptions } from '@sbc/components';
import { FinancingService } from './../../../../shared/services/financing/financing.service';
import { timeout } from 'q';
import { UtilsService } from '../../../../shared/services';
import { BudgetService } from '../../../../shared/services/budget/budget.service';

@Component({
  selector: 'sas-calculate-budgets',
  templateUrl: './calculate-budgets.component.html',
  styleUrls: ['./calculate-budgets.component.scss']
})
export class CalculateBudgetsComponent implements OnInit, OnChanges {

  @ViewChild('slider', { static: false }) sliderRef: ElementRef;
  @ViewChild('inputSlider', { static: false }) inputSliderRef: ElementRef;
  @Input() totalAmount: number;
  @Input() valoresPresupuesto: any;
  @Input() financingRequestDetail: any;
  @Output() calculateValues = new EventEmitter();
  @Output() onFormInitialized = new EventEmitter();
  public months: SBCSelectOptions[] = [];
  public amountFrac: string;
  public sixMonth = '6';
  public calculateForm: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private budgetService: BudgetService, private translate: TranslateService, private utilsService: UtilsService) { }

  ngOnInit() {
    if (!this.calculateForm) {
      this.setInitialForm();
    }
    this.calculateForm.controls.month.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      this.emitValuesCalculate(val);
    });
    if (this.totalAmount < this.valoresPresupuesto.minAmount) {
      this.calculateForm.disable();
      this.calculateForm.controls.slider.setValue(this.totalAmount);
      this.calculateForm.controls.inputSlider.setValue(this.totalAmount);
    } else {
      this.calculateForm.enable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.financingRequestDetail && changes.financingRequestDetail.currentValue) {
      this.months.push(
        {
          value: changes.financingRequestDetail.currentValue.months.toString(),
          text: changes.financingRequestDetail.currentValue.months.toString() + this.translate.instant('HOME.COMPONENTS.CALCULATE_BUDGETS.MONTH')
        });
    }

    if (changes.totalAmount && changes.totalAmount.currentValue) {
      if (changes.totalAmount.currentValue < this.valoresPresupuesto.minAmount) {
        if (this.calculateForm) {
          this.calculateForm.disable();
          this.calculateForm.controls.slider.setValue(changes.totalAmount.currentValue);
          this.calculateForm.controls.inputSlider.setValue(changes.totalAmount.currentValue);
          this.emitValuesCalculate();
        }
      } else {
        this.searchIntervals(changes.totalAmount.currentValue);
        if (this.calculateForm) {
          this.calculateForm.enable();
          this.calculateForm.controls.slider.setValue(changes.totalAmount.currentValue);
          this.calculateForm.controls.inputSlider.setValue(changes.totalAmount.currentValue);
          this.emitValuesCalculate();

        }
      }
    }
  }

  ngAfterViewInit() {
    fromEvent(this.sliderRef.nativeElement, 'change')
      .pipe(
        map(() => {
          return this.sliderRef.nativeElement.value;
        })
      ).subscribe(value => {
        this.calculateForm.controls.inputSlider.setValue(value);
        this.emitValuesCalculate();
        this.searchIntervals(value);
        this.resetMaxCheck(value);


      });

    fromEvent(this.inputSliderRef.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map(() => {
          return this.inputSliderRef.nativeElement.value;
        })
      ).subscribe(value => {
        const numberValue = this.utilsService.parseToNumber(value);
        this.calculateForm.controls.slider.setValue(numberValue);
        this.emitValuesCalculate();
        this.searchIntervals(value);
        this.resetMaxCheck(value);

      });
    this.calculateForm.controls.slider.setValue(this.financingRequestDetail ? this.financingRequestDetail.amount : this.totalAmount);
    this.calculateForm.controls.inputSlider.setValue(this.financingRequestDetail ? this.financingRequestDetail.amount : this.totalAmount);
    this.onFormInitialized.emit();
  }

  searchIntervals(value: number) {
    const interval = this.valoresPresupuesto.intervals.filter(inter => {
      return (value <= inter.maxAmount && value >= inter.minAmount);
    });
    if (interval[0]) {
      this.months = [];
      interval[0].months.forEach(month => {
        this.months.push({ value: month.toString(), text: month.toString() + this.translate.instant('HOME.COMPONENTS.CALCULATE_BUDGETS.MONTH') });
      });
    }
  }

  checkMaxAmount(ev) {
    if (ev.target.checked === true) {
      this.calculateForm.controls.slider.setValue(this.totalAmount);
      this.calculateForm.controls.inputSlider.setValue(this.totalAmount);
      this.emitValuesCalculate();
    }
  }

  resetMaxCheck(value) {
    if (value !== this.totalAmount) {
      this.calculateForm.controls.checkMax.setValue(false);
    }
  }

  emitValuesCalculate(months?: number) {
    const percentage = 100;
    const decimals = 2;
    const calculateMonths = months || this.calculateForm.value.month;
    if (this.calculateForm.value.slider || this.calculateForm.value.slider === 0) {
      this.amountFrac = this.budgetService.fractionateBudget(this.calculateForm.value.slider, calculateMonths);
    } else {
      this.amountFrac = null;
    }
    this.calculateValues.emit({ amount: this.calculateForm.value.slider, month: calculateMonths });
  }

  setInitialForm() {
    let month;
    if (!this.months.length) {
      this.months.push({ value: this.sixMonth, text: this.sixMonth + this.translate.instant('HOME.COMPONENTS.CALCULATE_BUDGETS.MONTH') });
    }
    if (this.financingRequestDetail && this.financingRequestDetail.months) {
      month = this.financingRequestDetail.months.toString();
    }
    this.calculateForm = new FormGroup({
      month: new FormControl(month || this.months[0].value),
      slider: new FormControl(this.financingRequestDetail ? this.financingRequestDetail.amount : this.totalAmount),
      inputSlider: new FormControl(this.financingRequestDetail ? this.financingRequestDetail.amount : this.totalAmount),
      checkMax: new FormControl(false)
    });
  }
}
