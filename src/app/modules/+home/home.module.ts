import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SBCModalModule, SBCInputSelectModule, SBCButtonModule, SBCLoadingModule, SBCInputCalendarModule,
  SBCInputSelectMultipleModule, SBCSearchFilterModule, SBCPaginatorModule } from '@sbc/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { StepBarComponent } from './components/step-bar/step-bar.component';
import { NavTabsComponent } from './components/nav-tabs/nav-tabs.component';
import { InfoBoxComponent } from './components/info-box/info-box.component';
import { FeasibilityRequestComponent } from './containers/feasibility-request/feasibility-request.component';
import { BudgetSelectionComponent } from './containers/budget-selection/budget-selection.component';
import { GenerateRequestComponent } from './containers/generate-request/generate-request.component';
import { FractionationProcessComponent } from './containers/fractionation-process/fractionation-process.component';
import { ListBudgetsComponent } from './components/list-budgets/list-budgets.component';
import { FeasibilityResultComponent } from './components/feasibility-result/feasibility-result.component';
import { AlertComponent } from './components/alert/alert.component';
import { BtnBlockBottomComponent } from './components/btn-block-bottom/btn-block-bottom.component';
import { MultiLanguageService, ApiService } from '../../shared/services';

import { HomeMainComponent } from './containers/home-main/home-main.component';

import { routes } from './home.routes';
import { FiltersComponent } from './components/filters/filters.component';
import { SuccessMsgComponent } from './components/success-msg/success-msg.component';
import { InfoFinancingComponent } from './components/info-financing/info-financing.component';
import { ListRequestComponent } from './containers/list-request/list-request.component';
import { AlertInfoComponent } from './components/alert-info/alert-info.component';
import { CalculateBudgetsComponent } from './components/calculate-budgets/calculate-budgets.component';
import { KeysPipe } from '../../shared/pipes';
import { TableDetailComponent } from './components/table-detail/table-detail.component';
import { AddDocComponent } from './containers/add-doc/add-doc.component';

@NgModule({
  declarations: [
    HomeMainComponent,
    StepBarComponent,
    NavTabsComponent,
    InfoBoxComponent,
    FeasibilityRequestComponent,
    BudgetSelectionComponent,
    GenerateRequestComponent,
    FractionationProcessComponent,
    ListBudgetsComponent,
    FeasibilityResultComponent,
    AlertComponent,
    BtnBlockBottomComponent,
    FiltersComponent,
    SuccessMsgComponent,
    InfoFinancingComponent,
    ListRequestComponent,
    AlertInfoComponent,
    CalculateBudgetsComponent,
    TableDetailComponent,
    AddDocComponent,
    CalculateBudgetsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SBCButtonModule,
    SBCModalModule,
    SBCInputSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SBCInputCalendarModule,
    SBCInputSelectMultipleModule,
    SBCSearchFilterModule,
    SBCLoadingModule,
    SharedModule,
    SBCPaginatorModule
  ],
  providers: [
    ApiService,
    MultiLanguageService,
    KeysPipe
  ]
})
export class HomeModule { }
