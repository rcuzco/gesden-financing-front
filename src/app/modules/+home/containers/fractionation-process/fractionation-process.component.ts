import { STEPS_LIST } from './../../../../shared/constants/steps-list/steps-list.constants';
import { Component, OnInit } from '@angular/core';
import { FinancingRequest } from '../../../../shared/models';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { STATUS } from './../../../../shared/constants/status-request/status-request.constant';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { StepBarService } from '../../../../shared/services/step-bar/step-bar.service';
import { SBCLoadingService } from '@sbc/components';

@Component({
  selector: 'sas-fractionation-process',
  templateUrl: './fractionation-process.component.html',
  styleUrls: ['./fractionation-process.component.scss']
})
export class FractionationProcessComponent implements OnInit {
  public financingData: FinancingRequest;
  public activeFeasibility: boolean = false;
  public activeBudget: boolean = false;
  public activeGenerate: boolean = false;
  public okStatus: boolean = false;
  public koStatus: boolean = false;
  public showAlert: boolean = false;
  public showSuccessMsg: boolean = false;
  public statusDescr: string;
  public listSteps = STEPS_LIST;
  public textAlert: string;
  public showMsgSuccess: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private financingService: FinancingService,
    private stepBarService: StepBarService,
    private loadingService: SBCLoadingService,
  ) {
    this.stepBarService.stepListChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(stepActive => {
      this.activeFeasibility = stepActive === STEPS_LIST.CONSULTA.id;
      this.activeBudget = stepActive === STEPS_LIST.SELECCION.id;
      this.activeGenerate = stepActive === STEPS_LIST.GENERAR.id;
      this.showSuccessMsg = stepActive === STATUS.REQUEST_FINISH.id;
    });
  }

  ngOnInit() {
    this.getFinancingData();
  }

  getFinancingData() {
    const service = this.financingService.getRequestId()
      ? this.financingService.financingRequestsID(this.financingService.getRequestId())
      : this.financingService.financingRequestsPreview();
    this.loadingService.show();
    service
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((financing: FinancingRequest) => {
        this.financingData = financing;
        this.getStatusDescr();
      });
  }

  checkViability() {
    this.loadingService.show();
    this.financingService
      .financingRequests()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((res: FinancingRequest) => {
        this.financingData = res;
        this.financingService.setRequestId(this.financingData.id.toString());
        this.getStatusDescr();
      });
  }

  getStatusDescr() {

    if (this.financingData && Number.isInteger(this.financingData.status)) {
      const valueStatus = Object.keys(STATUS).find(
        status => STATUS[status].id === this.financingData.status
      );
      this.statusDescr = STATUS[valueStatus].value;
      this.okStatus = this.financingData.status === STATUS.REQUEST_INOK.id || this.financingData.status === STATUS.REQUEST_OK.id;
      this.koStatus = this.financingData.status === STATUS.REQUEST_KO.id;
    } else {
      this.statusDescr = 'HOME.CONTAINERS.FRACTIONATION_PROCESS.REQUEST_PROCESS';
    }
  }

  saveBudgets(body) {
    this.financingService.financingRequestsIDTerms(this.financingService.getRequestId(), body)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((res) => {
      this.financingData.financingBudgetDetails = res.budgets.map(budget => {
        return {budget: budget.id, budgetName: budget.description};
      });
      this.financingData.financingRequestDetail = res;
      this.stepBarService.nextStep(STEPS_LIST.GENERAR.id);
    });
  }

  setFinancingStatus(status: number) {
    this.financingData.status = status;
    this.getStatusDescr();
  }

  getInfoAlert(event) {
    this.showAlert = event.show;
    this.textAlert = event.text;
    this.financingData.status = event.status;
    this.financingData = { ...this.financingData };
    this.getStatusDescr();
  }

  generateRequest(event) {
    this.showSuccessMsg = event;
    this.getStatusDescr();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
