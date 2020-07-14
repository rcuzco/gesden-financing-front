import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SBCNotFoundModule } from '@sbc/components';
import { NoContentComponent } from './no-content.component';
import { ROUTES_CONSTANTS } from './../../constants/routes/routes.constants';

describe('NoContentComponent', () => {
  let component: NoContentComponent;
  let router: Router;
  let fixture: ComponentFixture<NoContentComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        NoContentComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        SBCNotFoundModule,
        RouterTestingModule.withRoutes([
          { path: ROUTES_CONSTANTS.HOME.path, component: NoContentComponent }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA]

    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NoContentComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
    });

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a goBack method', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(routerSpy).toHaveBeenCalledWith([ROUTES_CONSTANTS.HOME.path]);
  });
});


