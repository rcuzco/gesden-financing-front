import { FinancingPeople } from '../../../../shared/models/financing-requests/financing-people.model';
import { Component, OnInit, Input } from '@angular/core';
import { DOCTYPES } from './../../../../shared/constants/doc-type/doc-type.constant';

@Component({
  selector: 'sas-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {

  @Input() infoFinancing: FinancingPeople;
  public docTypes = DOCTYPES;
  public titleBox: string;

  constructor() {/* BLOCK EMPTY */ }

  ngOnInit() {
    this.titleBox = this.infoFinancing.cardNumber ? 'HOME.COMPONENTS.INFO_BOX.TITLE_PACIENT' : 'HOME.COMPONENTS.INFO_BOX.TITLE_CUSTOMER';
  }

}
