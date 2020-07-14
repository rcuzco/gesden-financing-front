import { FinancingCheckDetail } from './../../../../shared/models/financing-requests/financing-check-detail.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sas-feasibility-result',
  templateUrl: './feasibility-result.component.html',
  styleUrls: ['./feasibility-result.component.scss']
})
export class FeasibilityResultComponent implements OnInit {

  @Input() infoFeasibility: FinancingCheckDetail;
  public textAsnef: string;
  public textTis: string;
  public showAsnef: boolean;

  ngOnInit() {
    this.textTis = this.infoFeasibility.tisCheck ? 'HOME.COMPONENTS.FEASIBILITY_RESULT.YES_FEASIBILITY' : 'HOME.COMPONENTS.FEASIBILITY_RESULT.NO_FEASIBILITY';
    if (this.infoFeasibility.hasOwnProperty('asnefCheck')) {
      this.textAsnef = this.infoFeasibility.asnefCheck ? 'HOME.COMPONENTS.FEASIBILITY_RESULT.YES_FEASIBILITY' : 'HOME.COMPONENTS.FEASIBILITY_RESULT.NO_FEASIBILITY';
    } else {
      this.textAsnef = 'HOME.COMPONENTS.FEASIBILITY_RESULT.ASNEF_PENDING';
    }
  }
}
