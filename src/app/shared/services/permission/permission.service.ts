import { Injectable } from '@angular/core';
import { TokenService } from '../token';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private tokenService: TokenService) {}

  hasPermission(permission: string) {
    return this.tokenService.getPermissionsFromStorage().includes(permission);
  }

}
