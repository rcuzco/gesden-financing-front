import { ROUTES_CONSTANTS } from './../../../shared/constants/routes/routes.constants';
import { Router } from '@angular/router';
import { AuthService } from './../../../shared/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { GesdenService } from './../../../shared/services/gesden/gesden.service';
import { NAV_TAB_LIST } from '../../../shared/constants/nav-tabs-list/nav-tabs-list.constants';
import { NavTabsService } from '../../../shared/services/nav-tabs/nav-tabs.service';

@Component({
  selector: 'sas-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit  {
  public tooltip = false;
  public mobileMenu: boolean = false;
  public listSection = NAV_TAB_LIST;
  public activeNav: number;

  constructor(
    public gesdenService: GesdenService,
    private authService: AuthService,
    private router: Router,
    private navTab: NavTabsService
    ) { }

  ngOnInit(){
    if (this.gesdenService.getCustomerId() || this.gesdenService.getPatientId()) {
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

  actionTooltip(){
    this.tooltip = !this.tooltip;
  }

  actionMobileMenu(){
    this.mobileMenu = !this.mobileMenu;
  }

  logout(){
    this.tooltip = false;
    this.authService.logout();
  }

}
