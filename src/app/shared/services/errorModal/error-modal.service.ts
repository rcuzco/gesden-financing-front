import { Injectable } from '@angular/core';
import { SBCModalButton } from '@sbc/components';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {

  public statusModal: boolean = false;
  public textModal: string;
  public primerButton: SBCModalButton;

  constructor(private router: Router) {}

  public showModal() {
    this.statusModal = true;
  }

  public hideModal() {
    this.statusModal = false;
    if (!this.primerButton) {
      return;
    }
    this.primerButton.action = () => {
      this.hideModal();
    };
  }

  public errorTextModal(msgError: string) {
    this.textModal = msgError;
  }

  public setErrorRoute(route) {
    if (!route) {
      return;
    }
    this.primerButton.action = () => {
      this.router.navigate([route]);
      this.hideModal();
    };
  }

}
