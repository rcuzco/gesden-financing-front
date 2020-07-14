import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../../../shared/services/users/users.service';
import { Users, FinancingRequest } from '../../../../shared/models';
import { USER_TYPES } from '../../../../shared/constants/user-types';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { STATUS } from '../../../../shared/constants/status-request';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsService } from '../../../../shared/services';
import { DOC_REQUEST } from '../../../../shared/constants/doc-request';

@Component({
  selector: 'sas-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss']
})
export class TableDetailComponent implements OnInit {

  @Input() request: FinancingRequest;
  @Output() onOpenAddDoc: EventEmitter<any> = new EventEmitter();
  @Output() onSendDocValidation: EventEmitter<any> = new EventEmitter();

  public user: Users;
  public isFinancing: boolean;
  public buttons: Array<any>;
  public reason: string = '';
  public showReason: boolean;
  public showFirstPay: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private financingService: FinancingService,
    private utilsService: UtilsService
  ) { /* EMPTY BLOCK */ }

  ngOnInit() {
    this.user = this.usersService.getUserInfo();
    this.isFinancing = this.user.type === USER_TYPES.FINANCING.id;
    this.showReason = this.user.type === USER_TYPES.FINANCING.id && this.request.status === STATUS.REQUEST_VALIDATE_DOC.id;
    this.showFirstPay = this.request.status === STATUS.REQUEST_APPROVED.id;
    this.setButtons();
  }

  getDocument(requestId, documentName) {
    const nameToSend = this.removeExtension(documentName);
    this.financingService.getDocument(requestId, nameToSend)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const nameToOpen = requestId + '_' + this.getDownloadName(documentName);
        const extension = this.getFileExtension(documentName);
        this.utilsService.openFile(res.body, nameToOpen, extension);
      });
  }

  getShowDocName(documentName) {
    const docString = this.removeExtension(documentName);
    const docObj = DOC_REQUEST.find(doc => docString === doc.id);
    return docObj.showName;
  }

  openAddDoc() {
    this.onOpenAddDoc.emit(this.request);
  }

  setButtons() {
    const buttonsStatus = {};
    const addDocButtons = [
      {
        name: 'ADD_DOC',
        action: () => {
          this.openAddDoc();
        }
      }
    ];
    const validateButtons =  [
      {
        name: 'VALIDATE',
        action: () => {
          this.setStatus('VALIDATE');
        }
      },
      {
        name: 'RETURN',
        compulsoryReason: true,
        action: () => {
          this.setStatus('CHECK_DOCUMENT', true);
        }
      },
      {
        name: 'REFUSE_ASNEF',
        action: () => {
          this.setStatus('ASNEF_DENIED');
        }
      }
    ];
    buttonsStatus[STATUS.REQUEST_OK.id] = {
      [USER_TYPES.CLINIC.id]: addDocButtons,
      [USER_TYPES.FINANCING.id]: []
    };
    buttonsStatus[STATUS.REQUEST_REVIEW_DOC.id] = {
      [USER_TYPES.CLINIC.id]: addDocButtons,
      [USER_TYPES.FINANCING.id]: []
    };
    buttonsStatus[STATUS.REQUEST_VALIDATE_DOC.id] = {
      [USER_TYPES.FINANCING.id]: validateButtons
    };
    const type = this.isFinancing ? USER_TYPES.FINANCING.id : USER_TYPES.CLINIC.id;
    if (!buttonsStatus[this.request.status]) {
      return;
    }

    this.buttons = buttonsStatus[this.request.status][type];

  }

  setStatus(status, compulsoryReason?: boolean) {
    if (compulsoryReason && !this.reason) {
      return;
    }
    const body = {
      reason: this.reason,
      approvalUser: this.user.id,
      actionName: status
    };
    this.financingService.setDocumentationStatus(this.request.id, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.onSendDocValidation.emit();
      });
  }

  trackButtons(index) {
    return index;
  }

  private getFileExtension(header) {
    return header.split('.').pop();
  }

  private getDownloadName(documentName) {
    const docString = this.removeExtension(documentName);
    const docObj = DOC_REQUEST.find(doc => docString === doc.id);
    return docObj.downloadName;
  }

  private removeExtension(documentName) {
    return documentName.split('.').slice(0, -1).join('.');
  }
}
