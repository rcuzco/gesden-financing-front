import { Component, Input } from '@angular/core';

@Component({
  selector: 'sas-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  @Input() alertText: string;

  constructor() {/* BLOCK EMPTY */ }

}
