import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  sliderOpts = {};

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }
  fblogin(){
    this.authService.facebookLogin();
  }

}
