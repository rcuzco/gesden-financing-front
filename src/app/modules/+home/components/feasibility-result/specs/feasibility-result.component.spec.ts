import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeasibilityResultComponent } from '../feasibility-result.component';
import { TranslateModule } from '@ngx-translate/core';

describe('FeasibilityResultComponent', () => {
  let component: FeasibilityResultComponent;
  let fixture: ComponentFixture<FeasibilityResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeasibilityResultComponent ],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityResultComponent);
    component = fixture.componentInstance;
    component.infoFeasibility = {};
    fixture.detectChanges();
  });

  it ('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set text variables if true', () => {
    component.infoFeasibility = {tisCheck: true, asnefCheck: true};
    component.ngOnInit();
    expect(component.textTis).toEqual('HOME.COMPONENTS.FEASIBILITY_RESULT.YES_FEASIBILITY');
    expect(component.textAsnef).toEqual('HOME.COMPONENTS.FEASIBILITY_RESULT.YES_FEASIBILITY');
  });

  it('should set text variables if false', () => {
    component.infoFeasibility = {tisCheck: false, asnefCheck: false};
    component.ngOnInit();
    expect(component.textTis).toEqual('HOME.COMPONENTS.FEASIBILITY_RESULT.NO_FEASIBILITY');
    expect(component.textAsnef).toEqual('HOME.COMPONENTS.FEASIBILITY_RESULT.NO_FEASIBILITY' );
  });

});
