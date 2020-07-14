import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public modalsIds = {
    loginError: null,
  };

  public modalsIds$: BehaviorSubject<any> = new BehaviorSubject(this.modalsIds);

  public setLoginErrorModalId(id: string): void {
    this.modalsIds.loginError = id;
    this.modalsIds$.next(this.modalsIds);
  }
}
