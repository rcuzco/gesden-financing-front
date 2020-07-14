import { Component, Input, SimpleChanges, OnChanges, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BudgetService } from '../../../../shared/services/budget/budget.service';
import { Subject } from 'rxjs';
import { Budget, Content } from '../../../../shared/models/budgets';
import { takeUntil, finalize } from 'rxjs/operators';
import { Filter } from '../../../../shared/models/filter';
import { SBCLoadingService } from '@sbc/components';
import { FinancingRequest } from '../../../../shared/models';

@Component({
  selector: 'sas-list-budgets',
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.scss']
})
export class ListBudgetsComponent implements OnChanges {
  @Input() filterDates: Filter;
  @Input() financingBudgetDetails: any;
  @Output() selectBudgets = new EventEmitter();
  public budgets: Array<Content> = [];
  public totalAmount: number = 0;
  public imageCheck: boolean = false;
  public showBudgetMsg: boolean = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private budgetService: BudgetService, private loadingService: SBCLoadingService) { }

  selectBudget(ev, budget: Content){
    const checked = !budget.checked;
    const decimals = 2;
    if (checked) {
      this.totalAmount = parseFloat((this.totalAmount + budget.amount).toFixed(decimals));
      budget.checked = true;
    }
    else{
      budget.checked = false;
      this.totalAmount = parseFloat((this.totalAmount - budget.amount).toFixed(decimals));
    }
    this.selectBudgets.emit({totalAmount: this.totalAmount, budgets: this.budgets});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filterDates && changes.filterDates.currentValue && Object.keys(changes.filterDates.currentValue).length > 0) {
      this.loadingService.show();
      this.totalAmount = 0;
      this.budgetService.getBudgets(changes.filterDates.currentValue)
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((res: Array<Content>)  => {
        this.showBudgetMsg = true;
        this.budgets = res;
        this.setCheckedBudgets();
        this.selectBudgets.emit({totalAmount: this.totalAmount, budgets: this.budgets});
      });
    }
  }

  setCheckedBudgets(){
    if (this.financingBudgetDetails && this.financingBudgetDetails.length) {
      this.budgets.forEach((budget: Content) => {
        this.financingBudgetDetails.forEach((detail: any) => {
          if (detail.budget === budget.id){
            budget.checked = true;
            this.totalAmount = this.totalAmount + budget.amount;
          }
        });
        return budget;
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
