import { TranslateService } from '@ngx-translate/core';
import { StepBarService } from './../../../../shared/services/step-bar/step-bar.service';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FinancingRequest } from './../../../../shared/models/financing-requests/financing-requests.model';
import { SBCModalButton } from '@sbc/components';
import { DOCTYPES } from '../../../../shared/constants/doc-type';
import { STATUS } from './../../../../shared/constants/status-request/status-request.constant';
import { STEPS_LIST } from '../../../../shared/constants/steps-list/steps-list.constants';

@Component({
  selector: 'sas-feasibility-request',
  templateUrl: './feasibility-request.component.html',
  styleUrls: ['./feasibility-request.component.scss']
})
export class FeasibilityRequestComponent implements OnInit, OnChanges {

  @Input() financingData: FinancingRequest;
  @Output() checkViability = new EventEmitter();
  @Output() validateNIF = new EventEmitter();
  public openModal: boolean = false;
  public titleModal: string;
  public validNIF: boolean = true;
  public docTypes = DOCTYPES;
  public status = STATUS;
  public okStatus: boolean;
  public yesButton: SBCModalButton = {
    text: this.translate.instant('HOME.COMPONENTS.MODAL.BUTTON_YES'),
    action: () => this.openModal = false,
  };
  public noButton: SBCModalButton = {
    text: this.translate.instant('HOME.COMPONENTS.MODAL.BUTTON_NO'),
    action: () => this.validateNIF.emit({
      show: true,
      text: 'HOME.COMPONENTS.ALERT.INCORRECT_NIF',
      status: this.status.REQUEST_KO.id,
    }),
  };

  constructor(public stepService: StepBarService, private translate: TranslateService) { }

  ngOnInit(){
    this.translate.get('HOME.COMPONENTS.MODAL.ASK_NIF', {
      documentType: this.docTypes[this.financingData.customer.docType].value,
      documentId: this.financingData.customer.docId,
      name: this.financingData.customer.firstName,
      lastName: this.financingData.customer.lastName
    }).subscribe(res => {
      this.titleModal = res;
    });
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes.financingData && changes.financingData.currentValue){
      this.okStatus = this.financingData.status !== this.status.REQUEST_KO.id;
      if (!this.financingData.id){
        this.openModal = true;
      }
    }
  }

  nextStep(){
    this.stepService.nextStep(STEPS_LIST.SELECCION.id);
  }

  emitCheckViability() {
    this.checkViability.emit();
  }

  controlDisabled(){

    if (this.financingData && this.financingData.financingCheckDetail &&
      this.financingData.financingCheckDetail.asnefCheck !== false &&
      this.financingData.financingCheckDetail.tisCheck) {
      return false;
    }
    return true;
  }

}
