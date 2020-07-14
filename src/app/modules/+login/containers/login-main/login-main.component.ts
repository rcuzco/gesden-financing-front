import { GesdenService } from './../../../../shared/services/gesden/gesden.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SBCLoadingService, SBCNotificationEnum, SBCNotificationsService } from '@sbc/components';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ROUTES_CONSTANTS } from '../../../../shared/constants';
import { AuthService } from '../../../../shared/services';
import { LoginUser } from '../../models';
import { SessionService } from '../../../../shared/services/session';

@Component({
  selector: 'sas-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent implements OnInit, OnDestroy {
  turn = false;
  isLogin = true;
  pages = ROUTES_CONSTANTS.LOGIN;
  backendLoginErrors = false;
  private returnUrl: string;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: SBCLoadingService,
    private notificationsService: SBCNotificationsService,
    private gesdenService: GesdenService,
    private authService: AuthService,
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.logout();
    this.returnUrl =
      this.route.snapshot.queryParamMap['returnUrl'] ||
      ROUTES_CONSTANTS.HOME.path;
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout(){
    this.sessionService.removeItem('requestId');
    this.authService.logout();
  }

  login({ username, password }: LoginUser) {
    const userNameLowerCase = username.toLowerCase();
    this.loader.show();
    this.auth
      .login(userNameLowerCase, password)
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(finalize(() => this.loader.hide()))
      .subscribe(
        () => {
          this.gesdenService.setUserId(username);
          this.router.navigate([this.returnUrl]);
        },
        err => {
          this.backendLoginErrors = true;
          this.notificationsService.addNotification({
            level: SBCNotificationEnum.ERROR,
            text: err.message,
            title: 'Login Failed'
          });
        }
      );
  }

}
