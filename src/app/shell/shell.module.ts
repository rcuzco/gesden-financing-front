import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MultiLanguageService } from '../shared/services';
import { SharedModule } from '../shared/shared.module';
import { ShellMainComponent } from './components/shell-main/shell-main.component';
import { routes } from './shell.routes';
import { HeaderComponent } from './components/header/header.component';

/**
 * Shell Module is common known as Application shell, this module isn't a lazy load module.
 * This module contains the main a minimum pieces of code of our application such a Toolbar,
 * Footer, etc... This allow us to load only the main content and avoid things that we don't need
 * at first load.
 */
@NgModule({
  declarations: [
    ShellMainComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  providers: [
    MultiLanguageService,
    TranslateService,
  ]
})
export class ShellModule { }
