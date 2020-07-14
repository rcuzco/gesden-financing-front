import { GesdenService } from './../../../../shared/services/gesden/gesden.service';
import { Component, OnInit, Input } from '@angular/core';
import { NAV_TAB_LIST } from './../../../../shared/constants/nav-tabs-list/nav-tabs-list.constants';
import { NavTabsService } from './../../../../shared/services/nav-tabs/nav-tabs.service';
import { UsersService } from '../../../../shared/services/users/users.service';
import { USER_TYPES } from '../../../../shared/constants/user-types';
import { Users } from '../../../../shared/models';

@Component({
  selector: 'sas-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss']
})
export class NavTabsComponent implements OnInit {

  @Input() user: Users;
  public activeNav: number;
  public listSection = NAV_TAB_LIST;

  constructor(private gesdenService: GesdenService, private navTab: NavTabsService) { }

  ngOnInit(){
    const isFinancing: boolean = this.user.type === USER_TYPES.FINANCING.id;
    if (!isFinancing && (this.gesdenService.getCustomerId() || this.gesdenService.getPatientId())) {
      this.activeNav = NAV_TAB_LIST.PROCESO.id;
    }else {
      this.activeNav = NAV_TAB_LIST.CONSULTA.id;
      delete this.listSection.PROCESO;
    }
    this.navTab.activeNav(this.activeNav);
  }

  selection(item){
    this.activeNav = item.value.id;
    this.navTab.activeNav(this.activeNav);
  }


}
