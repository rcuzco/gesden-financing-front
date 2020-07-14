import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SBCInputTextEnum, SBCInputLabelPositionEnum, SBCInputLabelPositionType, SBCInputTextType, SBCSelectOptions, SBCCalendarMsgs } from '@sbc/components';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Filter, Users } from '../../../../shared/models';
import { NAV_TAB_LIST } from './../../../../shared/constants/nav-tabs-list/nav-tabs-list.constants';
import { NavTabsService } from '../../../../shared/services/nav-tabs/nav-tabs.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UsersService } from '../../../../shared/services/users/users.service';
import { USER_TYPES } from '../../../../shared/constants/user-types';
import { FinancingService } from '../../../../shared/services/financing/financing.service';
import { UtilsService } from '../../../../shared/services';

@Component({
  selector: 'sas-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Input() dates: Filter;
  @Input() numberHistory: number;
  @Input() numberRequest: number;
  @Input() statusOptions: SBCSelectOptions[];
  @Input() centersOptions: SBCSelectOptions[];
  @Input() selectedCenters: Array<number>;
  @Input() selectedStatus: Array<number>;
  @Input() datesShow: boolean = true;
  @Output() filter: EventEmitter<any> = new EventEmitter();
  public openFilters = false;
  public hideFilters: boolean = false;
  public filterForm: FormGroup;
  public labelPosition: SBCInputLabelPositionType = SBCInputLabelPositionEnum.LEFT;
  public centers = [];
  public filteredOptions = [];
  public filterSearchCenters: boolean;
  public showExcel: boolean;
  private allCenters: Array<number>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public showFilters() {
    this.openFilters = !this.openFilters;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private navTab: NavTabsService,
    private usersService: UsersService,
    private financingService: FinancingService,
    private utilsService: UtilsService
  ) {
    this.navTab.navListChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (NAV_TAB_LIST.PROCESO && res === NAV_TAB_LIST.PROCESO.id) {
        this.hideFilters = true;
      } else if (NAV_TAB_LIST.CONSULTA && res === NAV_TAB_LIST.CONSULTA.id) {
        this.hideFilters = false;
      }
    });
  }


  ngOnInit() {
    const user: Users = this.usersService.getUserInfo();
    const isFinancing: boolean = user.type === USER_TYPES.FINANCING.id;
    this.allCenters = this.selectedCenters;
    this.filterForm = this.formBuilder.group({
      dateFrom: this.dates.dateFrom,
      dateTo: this.dates.dateTo,
      numberHistory: this.numberHistory,
      numberRequest: this.numberRequest,
      status: [],
      center: [],
      sort: isFinancing ? 'asc' : 'desc'

    });
    if (this.selectedCenters) {
      this.filterForm.controls.center.setValue(this.selectedCenters);
    }
    if (this.selectedStatus) {
      this.filterForm.controls.status.setValue(this.selectedStatus);
    }
    this.filterSearchCenters = isFinancing;
    if (isFinancing) {
      this.centers = user.centers;
    }
    this.showExcel = isFinancing && !this.hideFilters;
    this.onSubmit();
  }

  closeFilters() {
    this.openFilters = false;
  }

  downloadExcel() {
    const downloadName = 'solicitudes.xls';
    this.financingService.getFinancingRequestExcel(this.filterForm.value)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.utilsService.openExcel(res, downloadName);
    });
  }

  onSubmit() {
    this.openFilters = false;
    this.filter.emit(this.filterForm.value);
  }

  filterCenters(query) {
    let filteredOptions = [];
    if (!query) {
      this.filterForm.controls.center.setValue(this.allCenters);
    }
    if (typeof (query) !== 'string') {
      this.filteredOptions = [];
      return;
    }
    if (query.length < 3) {
      this.filteredOptions = [];
      return;
    }
    filteredOptions = this.centers.filter(option => {
      const text = this.removeAccents(option.name);
      const search = this.removeAccents(query);
      return text.includes(search);
    });
    this.filteredOptions = filteredOptions.map(option => {
      return { value: option.id, text: option.name };
    });
  }

  private removeAccents(s) {
    if (s.normalize) {
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    } else {
      // IE fix
      const i = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖŐòóôõöőÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜŰùúûüűÑñŠšŸÿýŽž'.split('');
      const o = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUUuuuuuNnSsYyyZz'.split('');
      const map = {};
      i.forEach((el, idx) => map[el] = o[idx]);
      return s.replace(/[^A-Za-z0-9]/g, (ch) => map[ch] || ch).toLowerCase();
    }
  }
}
