import { KeysPipe } from './pipes/keys.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SBCNotFoundModule } from '@sbc/components';
import { NoContentComponent } from './components';
import { HasPermissionDirective } from './directives';

@NgModule({
  imports: [
    CommonModule,
    SBCNotFoundModule,
    TranslateModule.forChild()
  ],
  declarations: [
    NoContentComponent,
    HasPermissionDirective,
    KeysPipe
  ],
  exports: [
    NoContentComponent,
    HasPermissionDirective,
    KeysPipe
  ]
})
export class SharedModule { }
