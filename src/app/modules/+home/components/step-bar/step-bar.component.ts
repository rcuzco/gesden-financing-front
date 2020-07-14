import { Component, Input } from '@angular/core';
import { StepBarService } from '../../../../shared/services/step-bar/step-bar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { STEPS_LIST } from './../../../../shared/constants/steps-list/steps-list.constants';
import { STATUS } from './../../../../shared/constants/status-request/status-request.constant';

@Component({
  selector: 'sas-step-bar',
  templateUrl: './step-bar.component.html',
  styleUrls: ['./step-bar.component.scss']
})
export class StepBarComponent {

  @Input() stepsList: any;
  public stepActive: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private stepBarService: StepBarService) {
    this.stepBarService.stepListChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(stepActive => {
      this.stepActive = stepActive;
    });
  }

  doingStep(step){
    if (step.id === STEPS_LIST.CONSULTA.id) {
      return this.stepActive === STEPS_LIST.SELECCION.id || this.stepActive === STEPS_LIST.GENERAR.id || this.stepActive === STATUS.REQUEST_FINISH.id;
    }else if (step.id === STEPS_LIST.SELECCION.id){
      return this.stepActive === STEPS_LIST.GENERAR.id || this.stepActive === STATUS.REQUEST_FINISH.id;
    }else if (step.id === STEPS_LIST.GENERAR.id){
      return this.stepActive === STATUS.REQUEST_FINISH.id;
    }
  }

}
