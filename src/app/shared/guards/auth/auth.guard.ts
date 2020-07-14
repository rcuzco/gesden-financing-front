import { TokenService } from './../../services/token/token.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../../services';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ROUTES_CONSTANTS } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    private token: TokenService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    this.token.getToken();
    return this.auth.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {

          // logged in so return true
          return true;
        }
        this.router.navigate([ROUTES_CONSTANTS.LOGIN.path], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      })
    );
  }

}
