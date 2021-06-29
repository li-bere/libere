import { Injectable } from "@angular/core";

import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";

import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { AuthService } from "./../../services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const firebaseUser = await this.authService.currentUserObservable
      .pipe(take(1))
      .toPromise();
    if (firebaseUser) {
      this.router.navigate(["home/dashboard"]);
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }

  async canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const firebaseUser = await this.authService.currentUserObservable
      .pipe(take(1))
      .toPromise();
    if (firebaseUser) {
    } else {
      this.router.navigate(["home"]);
      return false;
    }
    return true;
  }
}
