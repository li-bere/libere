import { Injectable } from '@angular/core';
import {
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router';

import { take } from 'rxjs/operators';

import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleShopkeeperGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    await this.authService.currentUserObservable.pipe(take(1)).toPromise();
    const user = await this.userService.getUser().pipe(take(1)).toPromise();
    if (user && user.roles && user.roles.shopkeeper) {
      return true;
    }
    return false;
  }
}
