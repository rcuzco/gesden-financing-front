import { ErrorModalService } from './../errorModal/error-modal.service';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SBCModalService } from '@sbc/components';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StateService } from '../state';
import { TokenService } from './../token/token.service';
import { ErrorManagerService } from '../errorManager';
import { TranslateService } from '@ngx-translate/core';

const UNAUTHORIZED_ERROR = 401;

@Injectable({
  providedIn: 'root'
})
export class RestInterceptor implements HttpInterceptor {

  private _errorModalId: string = null;

  constructor(
    private token: TokenService,
    private stateService: StateService,
    private modalService: SBCModalService,
    private errorService: ErrorModalService,
    private errorManagerService: ErrorManagerService,
    private translateService: TranslateService
    ) {
    this.stateService.modalsIds$
        .subscribe(({ loginError }) => this._errorModalId = loginError);
  }

  intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq;
    let error;
    authReq = req.clone();

    return next.handle(authReq).pipe(tap((event: HttpEvent<{}>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        error = this.errorManagerService.getMessageAndNavigate(err.error);
        this.errorService.errorTextModal(this.translateService.instant(error.message));
        this.errorService.setErrorRoute(error.route);
        this.errorService.showModal();
        if (err.status === UNAUTHORIZED_ERROR) {
          this.modalService.openModal(this._errorModalId);
        }
        return throwError(err);
      }
    }));
  }

}
