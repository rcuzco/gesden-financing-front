import { FinancingService } from './../../../../shared/services/financing/financing.service';
import { StepBarService } from './../../../../shared/services/step-bar/step-bar.service';
import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { Filter } from '../../../../shared/models/filter';
import { STEPS_LIST } from './../../../../shared/constants/steps-list/steps-list.constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilsService } from './../../../../shared/services/utils/utils.service';
import { SBCModalButton } from '@sbc/components';
import { TranslateService } from '@ngx-translate/core';
import { FinancingRequest } from '../../../../shared/models';
import { DatePipe } from '@angular/common';
import { STATUS } from '../../../../shared/constants/status-request';
import { BudgetService } from '../../../../shared/services/budget/budget.service';

@Component({
  selector: 'sas-budget-selection',
  templateUrl: './budget-selection.component.html',
  styleUrls: ['./budget-selection.component.scss']
})

export class BudgetSelectionComponent implements OnInit {
  @Input() financingData: FinancingRequest;
  public filterDates: Filter = new Object();
  public totalAmount: number;
  public budgets = [];
  public amount: number;
  public openModal: boolean = false;
  public months: number;
  public titleModal: string;
  public valoresPresupuesto: any;
  public validForm: boolean;
  public showAlertAmount: boolean;
  public alertAmountMsg: string;
  public requestSaved: any;
  public budgetSaved: any;
  public yesButton: SBCModalButton = {
    text: this.translate.instant('HOME.COMPONENTS.MODAL.BUTTON_YES'),
    action: () => this.saveBudgets(),
  };
  public noButton: SBCModalButton = {
    text: this.translate.instant('HOME.COMPONENTS.MODAL.BUTTON_NO'),
    action: () => this.openModal = false,
  };
  @Output() sendBudgets = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public stepService: StepBarService,
    public financingService: FinancingService,
    public utils: UtilsService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private budgetService: BudgetService
  ) { }

  ngOnInit() {
    this.filterDates = this.getInitialDates();
    this.financingService.financingIntervals().pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
      this.valoresPresupuesto = res;
      this.alertAmountMsg = this.translate.instant(
        'HOME.COMPONENTS.MODAL.INCORRECT_BUDGER_ALERT', {
          valueMin: this.valoresPresupuesto.minAmount,
          valueMax: this.valoresPresupuesto.maxAmount
        });
      this.translate.get('HOME.COMPONENTS.MODAL.INCORRECT_BUDGET', {
        valueMin: this.valoresPresupuesto.minAmount,
        valueMax: this.valoresPresupuesto.maxAmount,
      }).pipe(takeUntil(this.ngUnsubscribe)).subscribe(msg => {
        this.titleModal = msg;
      });
    });
  }

  public filter(filter: Filter) {
    this.filterDates = { dateFrom: filter.dateFrom, dateTo: filter.dateTo };
  }

  public getSelectBudget(values) {
    this.totalAmount = values.totalAmount;
    this.amount = values.totalAmount;
    this.budgets = values.budgets.filter(budget => budget.checked === true)
      .map(budget => {
        return {
          id: (budget.id).toString(),
          description: budget.description
        };
      });
    this.setValidForm();
    this.setRequestBudgets();

  }

  public getCalculateValues(values) {
    this.amount = values.amount;
    this.months = values.month;
    this.setValidForm();
  }

  public saveBudgets() {
    const percentage = 100;
    const decimals = 2;
    const body = {
      budgets: this.budgets,
      amount: this.amount.toString(),
      months: this.months,
      monthlyPayment: this.budgetService.fractionateBudget(this.amount, this.months),
      dateFrom: this.datePipe.transform(this.filterDates.dateFrom, 'yyyy-MM-dd'),
      dateTo: this.datePipe.transform(this.filterDates.dateTo, 'yyyy-MM-dd')
    };
    this.sendBudgets.emit(body);
  }

  public nextButton() {
    if (!this.validForm) {
      return;
    }
    if (this.financingData.status === STATUS.REQUEST_OK.id) {
      this.stepService.nextStep(STEPS_LIST.GENERAR.id);
      return;
    }
    if (this.valoresPresupuesto.minAmount <= this.amount && this.valoresPresupuesto.maxAmount >= this.amount) {
      this.saveBudgets();
    } else {
      this.openModal = true;
    }
  }

  public backStep() {
    this.stepService.nextStep(STEPS_LIST.CONSULTA.id);
    this.financingData.financingRequestDetail = this.requestSaved;
  }

  public setValidForm() {
    this.validForm = (!!this.months) && (!!this.amount) &&
      (this.amount <= this.valoresPresupuesto.maxAmount) &&
      (this.amount >= this.valoresPresupuesto.minAmount) &&
      (this.amount <= this.totalAmount);
    this.showAlertAmount = (this.amount > this.valoresPresupuesto.maxAmount || this.amount < this.valoresPresupuesto.minAmount);
    this.cdr.detectChanges();
  }

  public getInitialDates() {
    const defaultMonthsFrom = 3;
    const financingRequest = this.financingData ? this.financingData.financingRequestDetail || {} : {};
    const dates: any = {};

    dates.dateFrom = financingRequest.dateFrom ? new Date(financingRequest.dateFrom) : new Date();
    dates.dateTo = financingRequest.dateTo ? new Date(financingRequest.dateTo) : new Date();

    if (!financingRequest.dateFrom && !financingRequest.dateTo) {
      dates.dateFrom.setMonth(dates.dateFrom.getMonth() - defaultMonthsFrom);
    }

    return dates;
  }

  public setRequestBudgets() {
    this.financingData.financingBudgetDetails = this.budgets.map(budget => {
      return { budget: Number(budget.id), budgetName: budget.description };
    });
  }

  public showCalculateBudgetForm() {
    return this.valoresPresupuesto &&
    this.financingData &&
    (this.totalAmount > this.valoresPresupuesto.minAmount || this.financingData.financingRequestDetail) &&
    this.budgets.length;
  }

  public resetRequestCalculateBudgets() {
    if (!this.financingData.financingRequestDetail) {
      return;
    }
    this.requestSaved = this.utils.copyDeepObject(this.financingData.financingRequestDetail);
    this.financingData.financingRequestDetail = null;
  }
}
