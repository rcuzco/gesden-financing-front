import { STEPS_LIST } from './../../../../shared/constants/steps-list/steps-list.constants';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { StepBarService } from './../../../../shared/services/step-bar/step-bar.service';
import { STATUSSTEP } from './../../../../shared/constants/status-steps/status-steps.constant';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'sas-btn-block-bottom',
  templateUrl: './btn-block-bottom.component.html',
  styleUrls: ['./btn-block-bottom.component.scss']
})
export class BtnBlockBottomComponent {

  @Input() textButton: string;
  @Input() disabled: boolean;
  @Output() nextButton = new EventEmitter;
  @Output() backButton = new EventEmitter;
  public showBeforeButton: boolean = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public stepService: StepBarService) {
    this.stepService.stepListChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(stepActive => {
      this.showBeforeButton = stepActive !== STEPS_LIST.CONSULTA.id;
    });
  }

  nextStep(){
    this.nextButton.emit();
  }

  backStep(){
    this.backButton.emit();
  }

}
