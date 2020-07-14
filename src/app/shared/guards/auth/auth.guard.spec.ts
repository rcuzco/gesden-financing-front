import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOCKS } from '../../constants/tests';
import { EnvironmentService } from '../../services';
import { AuthService } from './../../services/auth/auth.service';
import { AuthGuard } from './auth.guard';


interface ValidToken {
  valid: boolean;
}

class AuthServiceMock {
  subject = new BehaviorSubject<ValidToken>(undefined);
  isLoggedIn$ = this.subject.asObservable().pipe(map(<ValidToken>(valid) => valid && !!valid.valid));

  getUser() { }
}

class mockActivatedRouteSnapshot {
  navigate(...args) { }
}

class mockRouterStateSnapshot {}


describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => guard = TestBed.get(AuthGuard));

  it('should ', () => {
    expect(guard).toBeTruthy();
  });

  it('should have a canActivate method', done => {
    (guard.canActivate(
      mockActivatedRouteSnapshot as any,
      mockRouterStateSnapshot as any) as Observable<boolean>)
    .subscribe(res => {
      expect(res).toBeFalsy();
      done();
    });
  });

  it('should have a canActivate method that return true if logged', done => {
    guard['auth'] = {
      isLoggedIn$: of(true),
      getUser: () => null,
    } as any;
    (guard.canActivate(
      mockActivatedRouteSnapshot as any,
      mockRouterStateSnapshot as any) as Observable<boolean>)
    .subscribe(res => {
      expect(res).toBeTruthy();
      done();
    });
  });
});
