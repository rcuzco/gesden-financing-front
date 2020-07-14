import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { AuthResponse } from '../../models';
import { ApiService } from '../api/api.service';
import { API_CALL_URL } from '../api/apiCallUrl.constants';
import { EnvironmentService } from '../environment/environment.service';
import { TokenService } from '../token';
import { SessionService } from './../session/session.service';
import { CustomEncoder } from './customEncoder';
import { SBCAuthService, SBCAuthConf } from '@sbc/components';
import { ROUTES_CONSTANTS } from '../../constants';
import { Router } from '@angular/router';

interface ValidToken {
  valid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  private subject = new BehaviorSubject<ValidToken>(undefined);

  constructor(
    private api: ApiService,
    private envConf: EnvironmentService,
    private token: TokenService,
    private sbcAuth: SBCAuthService,
    private router: Router
  ) {
    // Init variables
    this.isLoggedIn$ = this.subject.asObservable().pipe(map(valid => valid && !!valid.valid));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));
  }

  getUser() {
    const returnValue = !!this.sbcAuth.token;
    this.subject.next({ valid: returnValue });
  }

  login(user: string, password: string) {
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.LOGIN;
    const apiInstance = this.api.getApiInstance(
      API_CALL_URL.AUTH
    );
    const url = this.api.getApiUrl(
      urlPath,
      apiInstance
    );
    const sbcAuthConfig: SBCAuthConf = {
      loginUrl: url,
      appTokenId: this.envConf.data.authToken,
    };
    this.sbcAuth.setConfig(sbcAuthConfig);
    return this.sbcAuth.login(user, password).pipe(
      tap(() => {
        this.subject.next({ valid: true });
      })
    );
  }

  logout() {
    this.sbcAuth.logOut();
    this.router.navigate([ROUTES_CONSTANTS.LOGIN.path]);
    this.subject.next({ valid: false });
    this.token.removeToken();
  }

}
