import { TranslateService } from '@ngx-translate/core';
import { ErrorModalService } from './../../../../shared/services/errorModal/error-modal.service';
import { UsersService } from './../../../../shared/services/users/users.service';
import { Users } from './../../../../shared/models/users/users.model';
import { GesdenService } from './../../../../shared/services/gesden/gesden.service';
import { NavTabsService } from './../../../../shared/services/nav-tabs/nav-tabs.service';

import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize, filter } from 'rxjs/operators';
import { SBCModalButton, SBCLoadingService } from '@sbc/components';
import { Filter } from '../../../../shared/models/filter';
import { NAV_TAB_LIST } from '../../../../shared/constants/nav-tabs-list/nav-tabs-list.constants';
import { USER_TYPES } from '../../../../shared/constants/user-types';
import { FinancingRequest } from '../../../../shared/models';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
@Component({
  selector: 'sas-home-main',
  styleUrls: ['./home-main.component.scss'],
  templateUrl: './home-main.component.html'
})
export class HomeMainComponent implements OnInit, OnDestroy, AfterViewInit {

  public nameCenter: string;
  public activeProcess: boolean = false;
  public activeListRequest: boolean = false;
  public primerButton: SBCModalButton;
  public user: Users;
  public filterDates: Filter = new Object();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private userService: UsersService, private gesdenService: GesdenService, public errorModal: ErrorModalService,
    private loadingService: SBCLoadingService, private translate: TranslateService, private navTab: NavTabsService, private cdr: ChangeDetectorRef,
    private financingService: FinancingService) { }

  ngOnInit() {
    const defaultMonthsFrom = 3;
    this.errorModal.primerButton = {
      text: this.translate.instant('HOME.COMPONENTS.MODAL.BUTTON_ACCEPT'),
      action: () => this.errorModal.hideModal(),
    };
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - defaultMonthsFrom);
    this.filterDates = { dateFrom: dateFrom, dateTo: dateTo };
    this.getUsersData();
  }

  ngAfterViewInit(): void {
    this.navTab.navListChange.pipe(
      takeUntil(this.ngUnsubscribe),
      filter(() => !!this.user)
    ).subscribe(res => {
      if (NAV_TAB_LIST.PROCESO && res === NAV_TAB_LIST.PROCESO.id) {
        this.activeProcess = true;
        this.activeListRequest = false;
      } else if (NAV_TAB_LIST.CONSULTA && res === NAV_TAB_LIST.CONSULTA.id) {
        this.activeListRequest = true;
        this.activeProcess = false;
      }
      this.cdr.detectChanges();
    });
  }

  getAddDocRequest() {
    return this.financingService.requestToAddDoc;
  }

  getUsersData() {
    this.loadingService.show();
    const servicio = this.gesdenService.getCenterId() ? this.userService.getUsers() : this.userService.getUsersID();
    servicio.pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loadingService.hide())).subscribe((users: Users) => {
      this.nameCenter = users.centerName;
      this.userService.setUserInfo(users);
      this.user = users;
      if (users.type !== USER_TYPES.FINANCING.id && (this.gesdenService.getCustomerId() || this.gesdenService.getPatientId())) {
        this.activeProcess = true;
      } else {
        this.activeListRequest = true;
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    sessionStorage.clear();
    this.gesdenService.removeParametersGesden();
  }

}
