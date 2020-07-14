import { MultiLanguageService } from './../../../shared/services/multiLanguage/multiLanguage.service';
import { GesdenService } from './../../../shared/services/gesden/gesden.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../../../shared/services/auth/auth.service';
import { SessionService } from '../../../shared/services/session';
import { GESDENPARAMS } from './../../../shared/constants/gesden-params/gesden-params';
import { FinancingService } from '../../../shared/services/financing/financing.service';
import { SBCAuthService } from '@sbc/components';

@Component({
  selector: 'sas-shell',
  styleUrls: ['./shell-main.component.scss'],
  templateUrl: './shell-main.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ShellMainComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private sbcAuth: SBCAuthService,
    private translate: MultiLanguageService,
    private gesdenService: GesdenService,
    private financingService: FinancingService
  ) {}

  public ngOnInit() {
    this.translate.initialize();
    const url = document.URL;
    const urlParams = url.split('?')[1];
    if (urlParams) {
      this.getParamsGESDEN(urlParams);
    }
    this.auth.getUser();
    this.sbcAuth.isTokenRefreshing$.subscribe(() => console.log('Token refresh success'));
  }

  getAddDocRequest() {
    return this.financingService.requestToAddDoc;
  }

  public getParamsGESDEN(urlParams) {
    const params = urlParams.split('&');
    params.forEach((param: string) => {
      const value = param.split('=');
      switch (value[0]) {
        case GESDENPARAMS.USERID.value:
          this.gesdenService.setUserId(value[1]);
          break;
        case GESDENPARAMS.CENTERID.value:
          this.gesdenService.setCenterId(value[1]);
          break;
        case GESDENPARAMS.PATIENTID.value:
          this.gesdenService.setPatientId(value[1]);
          break;
        case GESDENPARAMS.CUSTOMERID.value:
          this.gesdenService.setCustomerId(value[1]);
          break;
        default:
          break;
      }
    });
  }
}
