import { KeysPipe } from './../../../../../shared/pipes/keys.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StepBarComponent } from '../step-bar.component';
import { TranslateModule } from '@ngx-translate/core';

describe('StepBarComponent', () => {
  let component: StepBarComponent;
  let fixture: ComponentFixture<StepBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepBarComponent, KeysPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doingStep', () => {
    it('should return true or false step active if id is CONSULTA id and ', () => {
      // this.stepActive === STEPS_LIST.SELECCION.id || this.stepActive === STEPS_LIST.GENERAR.id || this.stepActive === STATUS.REQUEST_FINISH.id
      component.stepActive = 2;
      expect(component.doingStep({id: 1})).toBeTruthy();
      component.stepActive = 1;
      expect(component.doingStep({id: 1})).toBeFalsy();
    });
    it('should return true or false step active if id is SELECCION id and ', () => {
      //  this.stepActive === STEPS_LIST.GENERAR.id || this.stepActive === STATUS.REQUEST_FINISH.id
      component.stepActive = 3;
      expect(component.doingStep({id: 2})).toBeTruthy();
      component.stepActive = 2;
      expect(component.doingStep({id: 2})).toBeFalsy();
    });
    it('should return true or false step active if id is GENERAR id and ', () => {
      component.stepActive = 3;
      expect(component.doingStep({id: 3})).toBeFalsy();
    });
    it('should do nothing if not previous', () => {
      expect(component.doingStep(10)).toBeUndefined();
    });
  });
});
