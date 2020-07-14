import { STEPS_LIST } from './../../constants/steps-list/steps-list.constants';
import { Injectable } from '@angular/core';
import { STATUSSTEP } from './../../constants/status-steps/status-steps.constant';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepBarService {

  public stepListChange: BehaviorSubject<any> = new BehaviorSubject<any>(STEPS_LIST.CONSULTA.id);
  private stepList = STEPS_LIST;

  constructor() { return; }

  public nextStep(step) {
    this.stepListChange.next(step);
  }

}
