import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UtilsService } from '../../../../shared/services';
import { finalize, takeUntil } from 'rxjs/operators';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { SBCLoadingService } from '@sbc/components';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sas-success-msg',
  templateUrl: './success-msg.component.html',
  styleUrls: ['./success-msg.component.scss']
})
export class SuccessMsgComponent {

  @Input() numberRequest: number;
  @Output() onPrintPDF: EventEmitter<any> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private utils: UtilsService,
    private financingService: FinancingService,
    private loadingService: SBCLoadingService,
    private translate: TranslateService
    ) { }

  showPDF(){
    const finalStatus = 2;
    this.loadingService.show();
    this.financingService.getFinancingRequestsIDTermsPdf(this.numberRequest)
    .pipe(takeUntil(this.ngUnsubscribe))
    .pipe(finalize(() => this.loadingService.hide()))
    .subscribe((pdf: any)  => {
      this.onPrintPDF.emit(finalStatus);
      this.utils.openFile(pdf, this.numberRequest + this.translate.instant('HOME.CONTAINERS.LIST_REQUEST.TABLE.PDF_REQUEST'), 'pdf');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
