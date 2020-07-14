import { Component, Input } from '@angular/core';

@Component({
  selector: 'sas-info-financing',
  templateUrl: './info-financing.component.html',
  styleUrls: ['./info-financing.component.scss']
})
export class InfoFinancingComponent{

  @Input() infoBudgets: any;
  @Input() infoAmount: any;

  constructor() {/*BLOCK EMPTY */ }

}
