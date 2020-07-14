import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnBlockBottomComponent } from '../btn-block-bottom.component';
import { TranslateModule } from '@ngx-translate/core';

describe('BtnBlockBottomComponent', () => {
  let component: BtnBlockBottomComponent;
  let fixture: ComponentFixture<BtnBlockBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnBlockBottomComponent ],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnBlockBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('nextStep', () => {
    it('should emit next buttom output', () => {
      spyOn(component.nextButton, 'emit');
      component.nextStep();
      expect(component.nextButton.emit).toHaveBeenCalled();
    });
  });

  describe('backStep', () => {
    it('should emit back buttom output', () => {
      spyOn(component.backButton, 'emit');
      component.backStep();
      expect(component.backButton.emit).toHaveBeenCalled();
    });
  });
});
