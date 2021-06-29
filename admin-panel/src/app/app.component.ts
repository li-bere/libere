import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { AuthService } from "./core/services/auth/auth.service";

@Component({
  // tslint:disable-next-line
  selector: "body",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  title = "CoreUI 2 for Angular 8";
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}
}
