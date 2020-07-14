import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AddDocComponent } from './add-doc.component';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalService } from '../../../../shared/services/errorModal/error-modal.service';
import { SBCLoadingService } from '@sbc/components';
import { HttpResponse } from '@angular/common/http';
import { UtilsService } from '../../../../shared/services';

const mockFinancingData = {
  id: 3,
  userId: '723723',
  status: 2,
  customer: {
    address: 'Madrid',
    docId: '322323',
    mail: 'prueba@gmail.com',
    firstName: 'Juan',
    lastName: 'Fernandez',
    docType: '1',
    medicalRecordId: 'e23r23r',
    cardNumber: '222222'
  },
  patient: {
    address: 'Madrid',
    docId: '322323',
    mail: 'prueba@gmail.com',
    firstName: 'Juan',
    lastName: 'Fernandez',
    docType: '1',
    medicalRecordId: 'e23r23r',
    cardNumber: '222222'
  },
  financingCheckDetail: {
    asnefCheck: false,
    tisCheck: true,
    tisCheckDate: '2020-02-03T17:06:09Z'
  },
  financingBudgetDetails: true,
  financingRequestDetail: {
    amount: 555,
    months: 12,
    monthlyPayment: 43
  },
  documentAttachment: {
    nifClient: 'nif',
    bankDocument: 'bankDocument',
    requestAttachment: 'requestAttachment',
    command: 'command'
  }
};

const mockReponseAddDocumentation = {
  bankDocument: 'Documento_bancario.pdf',
  command: 'Mandato.pdf',
  iban: 'ES6621000418401234567891',
  ibanTitular: true,
  nifClient: 'Cliente_nif.pdf',
  nifPatient: 'Paciente_nif.pdf',
  requestAttachment: 'Nombre_solicitud.pdf',
};

describe('AddDocComponent', () => {
  let component: AddDocComponent;
  let fixture: ComponentFixture<AddDocComponent>;
  let financingServiceStubSpy: jasmine.SpyObj<FinancingService>;
  let translateServiceStubSpy: jasmine.SpyObj<TranslateService>;
  let errorModalServiceStubSpy: jasmine.SpyObj<ErrorModalService>;
  let sBCLoadingServiceStubSpy: jasmine.SpyObj<SBCLoadingService>;
  beforeEach(async(() => {
    const spyFinancingService = jasmine.createSpyObj('FinancingService', ['sendRequestDocumentation', 'fetchCommand']);
    const spyTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    const spyErrorModalService = jasmine.createSpyObj('ErrorModalService', ['errorTextModal', 'showModal']);
    const spySBCLoadingService = jasmine.createSpyObj('SBCLoadingService', ['hide', 'show']);
    TestBed.configureTestingModule({
      providers: [FormBuilder,
        UtilsService,
        { provide: FinancingService, useValue: spyFinancingService },
        { provide: TranslateService, useValue: spyTranslateService },
        { provide: ErrorModalService, useValue: spyErrorModalService },
        { provide: SBCLoadingService, useValue: spySBCLoadingService }
      ],
      declarations: [AddDocComponent],
      imports: [ReactiveFormsModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    financingServiceStubSpy = TestBed.get(FinancingService);
    translateServiceStubSpy = TestBed.get(TranslateService);
    errorModalServiceStubSpy = TestBed.get(ErrorModalService);
    sBCLoadingServiceStubSpy = TestBed.get(SBCLoadingService);
    sBCLoadingServiceStubSpy.hide.and.callThrough();
    sBCLoadingServiceStubSpy.show.and.callThrough();
    financingServiceStubSpy.sendRequestDocumentation.and.returnValue(of(mockReponseAddDocumentation));
    financingServiceStubSpy.fetchCommand.and.returnValue(of(new Blob));
    translateServiceStubSpy.instant.and.returnValue('translate');
    errorModalServiceStubSpy.errorTextModal.and.callThrough();
    errorModalServiceStubSpy.showModal.and.callThrough();
    fixture = TestBed.createComponent(AddDocComponent);
    component = fixture.componentInstance;
    component.request = mockFinancingData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addValidators', () => {
    it('should set validators and return undefined if submitted form already', () => {
      component.onSubmit();
      component.onSubmit();
      expect(component.addValidators()).toBeUndefined();
    });
  });
  describe('cancelAddDoc', () => {
    it('should emit', () => {
      spyOn(component.closeAddDoc, 'emit');
      component.cancelAddDoc();
      expect(component.closeAddDoc.emit).toHaveBeenCalled();
    });
  });

  describe('fileChange', () => {
    it('should set docsToShow item', () => {
      component.ngOnInit();
      const file = new Blob();
      component.fileChange({ target: { files: [file] } }, 'Documento_bancario');
      expect(component.docsToShow.Documento_bancario).toEqual(file);
    });
  });

  describe('removeDocument', () => {
    it('should unset docsToShow item', () => {
      component.ngOnInit();
      component.docsToShow.Documento_bancario = 'Documento_bancario';
      component.removeDocument('Documento_bancario');
      expect(component.docsToShow.Documento_bancario).toBeNull();
    });
  });

  describe('isIbanValid', () => {
    it('should return if iban is valid', () => {
      component.ngOnInit();
      component.docsToShow['Paciente_nif'] = null;
      component.addDocForm.controls.iban.setValue('ES6621000418401234567891');
      expect(component.isIbanValid()).toBeFalsy();
    });
  });

  describe('submit', () => {
    it('should save with deletedocument flag if no patient nif and close', () => {
      spyOn(component.closeAddDoc, 'emit');
      component.request.documentAttachment.nifPatient = null;
      component.ngOnInit();
      component.docsToShow['Paciente_nif'] = null;
      component.addDocForm.controls.iban.setValue('ES6621000418401234567891');
      component.addDocForm.controls.isIbanTitular.setValue(true);
      component.onSubmit();
      expect(component.closeAddDoc.emit).toHaveBeenCalled();
      expect(financingServiceStubSpy.sendRequestDocumentation).toHaveBeenCalledWith(3, new FormData(),
      { iban: 'ES6621000418401234567891', isIbanTitular: true, deleteDocument: true });
    });
    it('should save without deletedocument flag if patient nif and close', () => {
      spyOn(component.closeAddDoc, 'emit');
      component.request.documentAttachment.nifPatient = 'nif';
      component.ngOnInit();
      component.addDocForm.controls.iban.setValue('ES6621000418401234567891');
      component.addDocForm.controls.isIbanTitular.setValue(true);
      component.onSubmit();
      expect(component.closeAddDoc.emit).toHaveBeenCalled();
      expect(financingServiceStubSpy.sendRequestDocumentation).toHaveBeenCalledWith(3, new FormData(),
      { iban: 'ES6621000418401234567891', isIbanTitular: true, deleteDocument: undefined });
    });
  });
});
