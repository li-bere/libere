import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { take } from 'rxjs/operators';
import { AuthService } from "./../../services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class RedirectGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

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
    }
  }
}
