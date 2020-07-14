
import { Injectable } from '@angular/core';
import { SessionService } from './../session/session.service';
import { AuthResponse } from './../../models/auth/auth-response.model';
import { TOKEN } from './../../constants/token/token.constants';

/**
 * Environment Service takes constants defined in /config/app.config.json and
 * creates a service with values and make them accesible throught a angular 2 service
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  authToken: string;
  refreshToken: string;
  authorities: string[];

  constructor(private session: SessionService) { }


  getToken() {
    if (!this.authToken) {
      const authTokenObject: AuthResponse = { access_token: this.getTokenFromStorage(TOKEN.AUTHTOKEN) };
      this.setToken(authTokenObject);
    }
    return this.authToken;
  }

  getPermissionsFromStorage() {
    if (!this.authorities) {
      this.authorities = JSON.parse(this.getTokenFromStorage(TOKEN.AUTHORITIES));
    }
    return this.authorities;
  }

  setToken(token: AuthResponse) {
    this.authToken = token && token.access_token;
    this.refreshToken = token && token.refresh_token;
    this.authorities = token && token.authorities;
    if (this.authToken) {
      this.session.setItem(TOKEN.AUTHTOKEN, this.authToken);
    }
    if (this.refreshToken) {
      this.session.setItem(TOKEN.REFRESHTOKEN, this.refreshToken);
    }
    if (this.authorities) {
      this.session.setItem(TOKEN.AUTHORITIES, JSON.stringify(this.authorities));
    }
  }

  removeToken() {
    this.authToken = null;
    this.refreshToken = null;
    this.authorities = null;
    this.session.removeItem(TOKEN.AUTHTOKEN);
    this.session.removeItem(TOKEN.REFRESHTOKEN);
    this.session.removeItem(TOKEN.AUTHORITIES);
  }

  private getTokenFromStorage(tokenName: TOKEN) {
    return this.session.getItem(tokenName);
  }

}
