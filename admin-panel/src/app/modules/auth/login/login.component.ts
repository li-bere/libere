import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastService } from './../../../core/services/toast/toast.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { ErrorhandlerService } from './../../../core/services/error-handler/error-handler.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private errorHandlerService: ErrorhandlerService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ])
      ],
      password: ["", Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
  }

  login(credentials: any) {
    this.authService
      .emailLogin(credentials.email, credentials.password)
      .then((res) => {
        this.authService
          .getUserToken()
          .then(token => {
            console.log("Token", token);
            if (token.claims.admin) {
              if (!token.claims.email_verified) {
                this.toastService.error(
                  "Your email is not verified. Please verify your email"
                );
                this.authService.logout();
                return;
              } else {
                this.toastService.success("You have successfully logged in");
                this.router.navigate(["/home/dashboard"]);
              }
            }
            else {
              this.toastService.error("You do not have the access to this Admin Panel");
              this.authService.logout();
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        this.errorHandlerService.displayErrorMessage(error.code);
      });
  }

  navigateTo() {
    this.router.navigate(["/register"]);
  }

}
