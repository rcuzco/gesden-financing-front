import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRequestComponent } from '../generate-request.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GenerateRequestComponent', () => {
  let component: GenerateRequestComponent;
  let fixture: ComponentFixture<GenerateRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateRequestComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
