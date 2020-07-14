import { Injectable } from '@angular/core';
import { EnvironmentService, API_CALL_URL } from '..';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GesdenService } from '../gesden/gesden.service';
import { Budget, Content } from '../../models/budgets';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BUDGET_CONSTANTS } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  constructor(
    private envConf: EnvironmentService,
    private http: HttpClient,
    private gesdenService: GesdenService,
    private datePipe: DatePipe
  ) {}

  getBudgets(dates: any) {
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.BUDGETS.path;
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set('patientId', this.gesdenService.getPatientId());
    queryParameters = queryParameters.set('dateOfCreationFrom', dates.dateFrom ? this.datePipe.transform(dates.dateFrom, 'yyyy-MM-dd') : null);
    queryParameters = queryParameters.set('dateOfCreationTo', dates.dateTo ? this.datePipe.transform(dates.dateTo, 'yyyy-MM-dd') : null);
    return this.http.get<Array<Content>>(url, { params: queryParameters });
  }

  getFinancingIntervals()
  {
    const result = {
      'minAmount': 500,
      'maxAmount': 5000,
      'intervals': [
        {
          'minAmount': 300,
          'maxAmount': 2000,
          'months': [6, 12]
        },
        {
          'minAmount': 600,
          'maxAmount': 7000,
          'months': [12, 18, 24]
        }
      ]
    };
    return of(result);
  }

  fractionateBudget(amount: number, months: number): string {
    const percentage: number = BUDGET_CONSTANTS.PERCENTAJE;
    const decimals: number = BUDGET_CONSTANTS.DECIMALS;
    return ((Math.floor(Math.round(amount * percentage) / months) / percentage).toFixed(decimals)).toString();
  }
}
