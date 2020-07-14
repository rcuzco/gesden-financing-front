import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { DOC_REQUEST } from '../../../../shared/constants/doc-request';
import { FinancingRequest } from '../../../../shared/models';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { UtilsService } from '../../../../shared/services';
import { ErrorModalService } from '../../../../shared/services/errorModal/error-modal.service';
import { TranslateService } from '@ngx-translate/core';
import { SBCLoadingService } from '@sbc/components';

@Component({
  selector: 'sas-add-doc',
  templateUrl: './add-doc.component.html',
  styleUrls: ['./add-doc.component.scss']
})
export class AddDocComponent implements OnInit {

  @Input() request: FinancingRequest;
  @Output() closeAddDoc: EventEmitter<any> = new EventEmitter();
  public addDocForm;
  public documents;
  public documentsToList;
  public mandatoryObj;
  public mandatoryShown = false;
  public docsToShow: any = {};
  private previousDocumentAttachment: Array<string>;
  private documentsUploaded: any = {};
  private formSubmitted: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private defaultFileName = 'files';
  private mandatoryFile = 'Mandato';

  constructor(private formBuilder: FormBuilder,
    private financingService: FinancingService,
    private utilsService: UtilsService,
    private errorService: ErrorModalService,
    private translateService: TranslateService,
    private loadingService: SBCLoadingService
    ) { /*EMPTY BLOCK*/ }

  ngOnInit() {
    this.mandatoryFile = 'Mandato';
    const iban = this.request.iban || '';
    const ibanTitular = !!this.request.iban;
    this.documents = DOC_REQUEST.filter(field => !!field.document);
    this.documentsToList = this.documents.filter(field => field.id !== this.mandatoryFile);
    this.mandatoryObj = this.documents.find(field => field.id === this.mandatoryFile);
    this.previousDocumentAttachment = Object.keys(this.request.documentAttachment);
    this.addDocForm = this.formBuilder.group({
      iban: new FormControl(iban),
      isIbanTitular: new FormControl(ibanTitular)
    });
    this.documents.forEach(field => {
      this.addDocForm.addControl(field.id, new FormControl(''));
    });
    this.addDocForm.controls.iban.setValidators([this.utilsService.validateIBAN]);
    window.scrollTo({
      top: 0,
      left: 0
    });
    this.initRequestDocuments();
  }

  addValidators() {
    if (this.formSubmitted) {
      return;
    }
    this.addDocForm.controls.iban.setValidators([Validators.required, this.utilsService.validateIBAN]);
    this.addDocForm.controls.isIbanTitular.setValidators(Validators.pattern('true'));
    this.documents.forEach(field => {
      if (field.required) {
        this.addDocForm.controls[field.id].setValidators([this.isValidFile(field.id), this.fileExists(field.id)]);
      } else {
        this.addDocForm.controls[field.id].setValidators(this.isValidFile(field.id));
      }
    });
    Object.keys(this.addDocForm.controls).forEach(field => {
      this.addDocForm.controls[field].updateValueAndValidity();
    });
  }

  cancelAddDoc() {
    this.closeAddDoc.emit();
  }

  fileChange(event, id) {
    const fileList: FileList = event.target.files;
    let file: File;
    if (fileList.length) {
      file = fileList[0];
      this.docsToShow[id] = file;
      this.formDataSetValue(id, file);
      if (!this.formSubmitted) {
        this.addDocForm.controls[id].setValidators(this.isValidFile(id));
      }
      this.addDocForm.controls[id].updateValueAndValidity();
    }
  }

  isIbanValid() {
    const iban = this.addDocForm.get('iban');
    if (!iban.value) {
      return {emptyIban: true};
    }
    return this.utilsService.validateIBAN(iban);
  }

  removeDocument(id) {
    this.addDocForm.controls[id].setValue('');
    delete this.documentsUploaded[id];
    this.docsToShow[id] = null;
    this.addDocForm.controls[id].updateValueAndValidity();
  }

  trackDocuments(index) {
    return index;
  }

  onSubmit() {
    const optionalDocument = 'Paciente_nif';
    const errorMaxSizeMsg = 'HOME.COMPONENTS.ADD_DOC.ERROR_MAX_SIZE';
    let deleteDocument: boolean;
    this.addValidators();
    this.formSubmitted = true;
    if (this.addDocForm.valid) {
      if (!this.hasValidTotalSize()) {
        this.errorService.errorTextModal(this.translateService.instant(errorMaxSizeMsg));
        this.errorService.showModal();
        return;
      }

      if (this.previousDocumentAttachment.length && !this.docsToShow[optionalDocument]) {
        deleteDocument = true;
      }
      const params = {
        iban: this.addDocForm.value.iban,
        isIbanTitular: this.addDocForm.value.isIbanTitular,
        deleteDocument: deleteDocument
      };
      const docsToSend: FormData = new FormData();
      Object.keys(this.documentsUploaded).forEach(id => {
        docsToSend.append(this.defaultFileName, this.documentsUploaded[id], id + '.' + this.getExtensionFile(this.documentsUploaded[id]));
      });
      this.loadingService.show();
      this.financingService.sendRequestDocumentation(this.request.id, docsToSend, params)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.loadingService.hide())
        )
        .subscribe(() => {
          this.closeAddDoc.emit(true);
        });
    }
  }

  showMandatory() {
    this.loadingService.show();
    this.financingService.fetchCommand(this.request.id, this.addDocForm.value.iban)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.loadingService.hide())
    )
    .subscribe((res) => {
      this.utilsService.openFile(res, this.mandatoryFile, 'pdf');
      this.mandatoryShown = true;
    });
  }

  private fileExists = (id) => {
    return (formControl: AbstractControl) => {
      return this.docsToShow[id] ? undefined : {fileEmpty: true};
    };
  }

  private initRequestDocuments() {
    if (this.previousDocumentAttachment.length) {
      this.mandatoryShown = true;
      this.previousDocumentAttachment.forEach(document => {
        const docRequest = this.documents.find(doc => doc.requestId === document);
        this.docsToShow[docRequest.id] = {
          name: this.request.documentAttachment[document]
        };
      });
      this.addValidators();
    }
  }

  private isValidFile = (id) => {
    return (formControl: AbstractControl) => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      const maxSize = 2000000;
      let error: boolean;
      if (this.documentsUploaded[id] && !validTypes.some(validType => this.docsToShow[id].type === validType)) {
        error =  true;
      }
      if (this.documentsUploaded[id] && this.docsToShow[id].size > maxSize) {
        error = true;
      }
      return error ? {wrongFile: true} : undefined;
    };
  }

  private formDataSetValue(id, data) {
    this.documentsUploaded[id] = data;
  }

  private getExtensionFile(doc) {
    return doc.name.split('.').pop().toLowerCase();
  }

  private hasValidTotalSize() {
    const maxSize = 10000000;
    const sizes = Object.keys(this.documentsUploaded).map(doc => this.documentsUploaded[doc].size);
    const realSize = sizes.reduce((a, b) => a + b, 0);
    return  realSize < maxSize;
  }

}
