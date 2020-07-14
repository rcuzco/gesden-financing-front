import { TestBed } from '@angular/core/testing';
import { TokenService } from '../token/token.service';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionService,
        TokenService
      ]
    });
    service = TestBed.get(PermissionService);
    tokenService = TestBed.get(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check permission', () => {
    spyOn(tokenService, 'getPermissionsFromStorage').and.returnValue(['permission.1', 'permission.2']);

    expect(service.hasPermission('permission.1')).toBeTruthy();
    expect(service.hasPermission('permission.2')).toBeTruthy();
    expect(service.hasPermission('permission.3')).toBeFalsy();
  });

});
