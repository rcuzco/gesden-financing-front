import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertInfoComponent } from '../alert-info.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('AlertInfoComponent', () => {
  let component: AlertInfoComponent;
  let fixture: ComponentFixture<AlertInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertInfoComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeAlert', () => {
    it('should set show variable false', () => {
      component.closeAlert();
      expect(component.show).toBeFalsy();
    });
  });
});
