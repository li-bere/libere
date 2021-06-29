import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const firebaseUser = await this.authService.currentUserObservable.pipe(take(1)).toPromise();
    if (firebaseUser) {
      // if (firebaseUser.emailVerified) {
        const user = await this.userService.getUser().pipe(take(1)).toPromise();
        if (user && user.username && user.username !== '') {
          return false;
        } else {
          return this.router.createUrlTree(['/user']);
        }
      // } else {
      //   return this.router.createUrlTree(['/verify-email']);
      // }
    } else {
      return true;
    }
  }
}
