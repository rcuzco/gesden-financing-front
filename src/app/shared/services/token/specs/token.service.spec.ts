import { AuthResponse } from './../../../models/auth/auth-response.model';
import { TestBed, inject } from '@angular/core/testing';

import { TokenService } from '../token.service';

describe('shared -> TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TokenService
      ]
    });

    tokenService = TestBed.get(TokenService);

  });

  it('Should be defined', () => {
    expect(tokenService).toBeDefined();
  });


  it('Should be token returned is same of setted previosly', () => {
    const accessToken = 'edasccs32';
    const response = <AuthResponse>{ access_token: accessToken };

    tokenService.setToken(response);
    const token = tokenService.getToken();

    expect(accessToken).toEqual(token);

  });

  it('Should be token returned is same of setted previosly', () => {
    const accessToken = 'edasccs32';
    const response = <AuthResponse>{ access_token: accessToken, refresh_token: accessToken };

    tokenService.setToken(response);
    const token = tokenService.getToken();

    expect(accessToken).toEqual(token);

  });

  it('Should be return token', () => {
    const accessToken = 'edasccs32';
    const response = <AuthResponse>{ access_token: accessToken, refresh_token: accessToken };

    tokenService.setToken(response);

    tokenService.authToken = null;
    const token = tokenService.getToken();

    expect(accessToken).toEqual(token);

  });

  it('Should return null', () => {
    const accessToken = 'edasccs32';
    const authorities = ['p1', 'p2'];
    const response = <AuthResponse>{ access_token: accessToken, refresh_token: accessToken, authorities };

    tokenService.setToken(response);

    tokenService.authToken = null;
    tokenService.authorities = null;

    const token = tokenService.getToken();
    const firstAuthoritiesRecovered = tokenService.getPermissionsFromStorage();

    expect(accessToken).toEqual(token);
    expect(firstAuthoritiesRecovered).toEqual(authorities);

    tokenService.removeToken();

    const tokenReturn = tokenService.getToken();
    expect(tokenReturn).toEqual(null);

    const secondAuthoritiesRecovered = tokenService.getPermissionsFromStorage();
    expect(secondAuthoritiesRecovered).toEqual(null);
  });

  it('Should store authorities and take them', () => {
    const accessToken = 'edasccs32';
    const authorities = ['p1', 'p2'];
    const response = <AuthResponse>{ access_token: accessToken, refresh_token: accessToken, authorities };

    tokenService.setToken(response);
    const authoritiesRecovered = tokenService.getPermissionsFromStorage();

    expect(authoritiesRecovered).toEqual(authorities);
  });

});
