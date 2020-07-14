import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoFinancingComponent } from '../info-financing.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('InfoFinancingComponent', () => {
  let component: InfoFinancingComponent;
  let fixture: ComponentFixture<InfoFinancingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoFinancingComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFinancingComponent);
    component = fixture.componentInstance;
    component.infoAmount = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
