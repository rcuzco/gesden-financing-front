import { Component } from '@angular/core';

@Component({
  selector: 'sas-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.scss']
})
export class AlertInfoComponent {

  public show: boolean = true;

  constructor() {/* BLOCK EMPTY */  }

  closeAlert(){
    this.show = false;
  }

}
