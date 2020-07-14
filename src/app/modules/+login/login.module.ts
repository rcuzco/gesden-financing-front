import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SBCLoginModule } from '@sbc/components';
import { SharedModule } from '../../shared/shared.module';
import { LoginMainComponent } from './containers';
import { ROUTES } from './login.routes';



@NgModule({
  declarations: [
    LoginMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SBCLoginModule,
  ]
})
export class LoginModule { }
