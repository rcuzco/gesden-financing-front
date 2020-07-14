import { Component, OnInit, SimpleChanges, OnChanges, Input } from '@angular/core';
import { Filter, Users, FinancingRequest } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { SBCLoadingService, SBCSelectOptions, SBCPagination } from '@sbc/components';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { UtilsService } from '../../../../shared/services';
import { UsersService } from '../../../../shared/services/users/users.service';
import { STATUS } from '../../../../shared/constants/status-request/status-request.constant';
import { TranslateService } from '@ngx-translate/core';
import { USER_TYPES } from '../../../../shared/constants/user-types';

@Component({
  selector: 'sas-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss']
})
export class ListRequestComponent implements OnInit {
  @Input() filterDates: Filter;

  public statusOptions: SBCSelectOptions[] = [];
  public centersOptions: SBCSelectOptions[] = [];
  public selectedCenters: Array<number> = [];
  public selectedStatus: Array<any> = [];
  public requests = [];
  public filterValues: any;
  public pdfStatus = [STATUS.REQUEST_OK.id];
  public itemSelect: boolean[] = [];
  public paginationInfo: SBCPagination;
  public showRequests: boolean;
  public statusClass: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userInfo: Users;
  private isFinancing: boolean;


  constructor(
    private financingService: FinancingService,
    private loadingService: SBCLoadingService,
    private utils: UtilsService,
    private userService: UsersService,
    private translate: TranslateService
  ) {/* BLOCK EMPTY */ }


  ngOnInit() {
    this.userInfo = this.userService.getUserInfo();
    this.isFinancing = this.userInfo.type === USER_TYPES.FINANCING.id;
    const dateTo = new Date();
    const dateFrom = new Date();
    const defaultMonthsFrom = 3;
    dateFrom.setMonth(dateFrom.getMonth() - defaultMonthsFrom);
    this.filterDates = { dateFrom: dateFrom, dateTo: dateTo };
    this.userInfo.centers.forEach(center => {
      this.selectedCenters.push(center.id);
      this.centersOptions.push({ value: center.id, text: center.name });
    });

    Object.keys(STATUS).forEach(key => {
      if (STATUS[key].value !== '') {
        this.statusOptions.push({ value: STATUS[key].id.toString(), text: this.translate.instant(STATUS[key].value) });
      }
    });
    this.addSelectedStatus();
  }

  addSelectedStatus() {
    if (this.isFinancing) {
      this.selectedStatus = USER_TYPES.FINANCING.selectedStatus.map(status => status.id.toString());
    } else {
      this.selectedStatus = USER_TYPES.CLINIC.selectedStatus.map(status => status.id.toString());
    }
  }

  public filter(filter: Filter) {
    const page = 0;
    this.filterDates = { dateFrom: filter.dateFrom, dateTo: filter.dateTo };
    this.filterValues = filter;
    this.itemSelect = [];
    this.getFinancingRequests(filter, page);
  }

  displayActivePage(activePageNumber: number) {
    this.paginationInfo.actualPage = activePageNumber;
    this.getFinancingRequests(this.filterValues, activePageNumber - 1);
  }

  getAddDocRequest() {
    return this.financingService.requestToAddDoc;
  }


  getFinancingRequests(filter, activePage) {
    this.loadingService.show();
    this.financingService
      .getFinancingRequests(filter, activePage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((res: any) => {
        if (!this.showRequests) {
          this.showRequests = true;
        }
        this.paginationInfo = {
          actualPage: activePage + 1,
          totalItems: res.totalElements,
          itemsPerPage: 5
        };
        this.itemSelect = [];
        this.resolveStatus(res.content);
        this.requests = res.content;
      });
  }


  resolveStatus(contents) {
    contents.forEach(content => {
      content.medicalRecordId = content.patient.medicalRecordId;
      switch (content.status) {
        case STATUS.REQUEST_KO.id:
          content.statusDescr = STATUS.REQUEST_KO.value + this.setDeniedType(content.financingCheckDetail);
          content.statusClass = 'sol-ko';
          break;
        case STATUS.REQUEST_INOK.id:
          content.statusDescr = STATUS.REQUEST_INOK.value;
          content.statusClass = 'sol-inko';
          break;
        case STATUS.REQUEST_OK.id:
          content.statusDescr = STATUS.REQUEST_OK.value;
          content.statusClass = 'sol-inprogress';
          break;
        case STATUS.REQUEST_APPROVED.id:
          content.statusDescr = STATUS.REQUEST_APPROVED.value;
          content.statusClass = 'sol-ok';
          break;
        case STATUS.REQUEST_REVIEW_DOC.id:
          content.statusDescr = STATUS.REQUEST_REVIEW_DOC.value;
          content.statusClass = 'sol-inprogress';
          break;
        case STATUS.REQUEST_VALIDATE_DOC.id:
          content.statusDescr = STATUS.REQUEST_VALIDATE_DOC.value;
          content.statusClass = 'sol-inprogress';
          break;
        default:
          break;
      }
    });
  }

  setDeniedType(financingDetail) {
    if (!financingDetail) {
      return '';
    }
    if (!financingDetail.tisCheck) {
      return '_TIS';
    }
    if (!financingDetail.asnefCheck) {
      return '_ASNEF';
    }
  }

  showPDF(id) {
    this.loadingService.show();
    this.financingService.getFinancingRequestsIDTermsPdf(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((pdf: any) => {
        this.utils.openFile(pdf, id + this.translate.instant('HOME.CONTAINERS.LIST_REQUEST.TABLE.PDF_REQUEST'), 'pdf');
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showDetail(index, status) {
    if (this.allowShowDetail(status)) {
      this.itemSelect[index] = !this.itemSelect[index];
    }
  }

  allowShowDetail(status) {
    if (this.isFinancing && !USER_TYPES.FINANCING.accessDetailStatus.some(item => item === status)) {
      return;
    }
    if (!this.isFinancing && !USER_TYPES.CLINIC.accessDetailStatus.some(item => item === status)) {
      return;
    }
    return true;
  }

  hasRequestPDF(status) {
    return this.pdfStatus.some(item => item === status);
  }

  trackRequests(index) {
    return index;
  }

  onOpenAddDoc(request) {
    this.financingService.requestToAddDoc = request;
  }

  onSendDocValidation() {
    this.filter(this.filterValues);
  }

  closeAddDoc(resetList?: boolean) {
    if (resetList) {
      this.filter(this.filterValues);
    }
    this.financingService.requestToAddDoc = null;
  }


}
