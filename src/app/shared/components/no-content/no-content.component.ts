import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from './../../constants/routes/routes.constants';

@Component({
  selector: 'ssas-no-content',
  templateUrl: './no-content.template.html',
})
export class NoContentComponent {

  constructor(private router: Router) {}

  public goBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.HOME.path]);
  }
}
