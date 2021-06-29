import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { UsersService } from "./../../../core/services/users/users.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {

  obj = Object;
  user: any;
  loadingSpinner: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.usersService.getUser(params["id"]).subscribe((user) => {
        console.log(user);
        this.user = user;
        this.loadingSpinner = false;
      });
    });
  }
}
