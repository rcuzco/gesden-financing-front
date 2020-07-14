import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InfoBoxComponent } from '../info-box.component';
import { FinancingPeople } from '../../../../../shared/models';

const defaultInfoFinancing: FinancingPeople = {
  firstName: 'firstName',
  lastName: 'lastName',
  address: 'address',
  mail: 'mail',
  docId: 'docId',
  docType: '',
};

describe('InfoBoxComponent', () => {
  let component: InfoBoxComponent;
  let fixture: ComponentFixture<InfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBoxComponent ],
      providers: [TranslateService],
      imports: [HttpClientModule, TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBoxComponent);
    component = fixture.componentInstance;
    component.infoFinancing =  defaultInfoFinancing;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set title with card number', () => {
      component.infoFinancing.cardNumber = 'number';
      component.ngOnInit();
      expect(component.titleBox).toEqual('HOME.COMPONENTS.INFO_BOX.TITLE_PACIENT');
    });
    it('should set title without card number', () => {
      component.infoFinancing.cardNumber = null;
      component.ngOnInit();
      expect(component.titleBox).toEqual('HOME.COMPONENTS.INFO_BOX.TITLE_CUSTOMER');
    });
  });
});
