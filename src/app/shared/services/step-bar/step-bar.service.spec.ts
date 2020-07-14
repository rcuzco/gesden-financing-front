import { STEPS_LIST } from './../../constants/steps-list/steps-list.constants';
import { STATUSSTEP } from './../../constants/status-steps/status-steps.constant';
import { TestBed } from '@angular/core/testing';
import { StepBarService } from './step-bar.service';

describe('StepBarService', () => {
  let service: StepBarService;
  beforeEach(() => { TestBed.configureTestingModule({});
    service = TestBed.get(StepBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute stepListChange.next', () => {
    spyOn(service.stepListChange, 'next');
    service.nextStep('2');
    expect(service.stepListChange.next).toHaveBeenCalledWith('2');
  });
});
