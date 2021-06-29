import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { take } from 'rxjs/operators';

import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmailGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const firebaseUser = await this.authService.currentUserObservable
      .pipe(take(1))
      .toPromise();
    // if (firebaseUser.emailVerified) {
      if (firebaseUser) {
      return true;
    }
    //  else {
    //   return this.router.createUrlTree(['/verify-email']);
    // }
  }
}
