import { STEPS_LIST } from './../../../../shared/constants/steps-list/steps-list.constants';
import { StepBarService } from './../../../../shared/services/step-bar/step-bar.service';
import { STATUS } from './../../../../shared/constants/status-request/status-request.constant';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FinancingRequest } from '../../../../shared/models';

@Component({
  selector: 'sas-generate-request',
  templateUrl: './generate-request.component.html',
  styleUrls: ['./generate-request.component.scss']
})
export class GenerateRequestComponent {

  @Input() financingData: FinancingRequest;
  @Output() generate = new EventEmitter();

  constructor(private stepService: StepBarService) {/* BLOCK EMPTY */ }

  generateRequest(){
    this.generate.emit(true);
    this.stepService.nextStep(STATUS.REQUEST_FINISH.id);
  }

  backStep(){
    this.stepService.nextStep(STEPS_LIST.SELECCION.id);
  }


}
