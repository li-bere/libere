import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
const { Keyboard } = Plugins;

import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formValue = {email: '', password: ''};
  form: FormGroup;

  passwordType = 'password';
  passwordIcon = 'eye';

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.platform.is('ios')) {
      this.passwordIcon = this.passwordIcon + '-outline';
    }
    this.form = new FormGroup({
      email: new FormControl(this.formValue.email, [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      ]),
      password: new FormControl(this.formValue.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/)
      ])
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  onSubmit() {
    console.log(this.form);
    this.authService.emailLogin(this.email.value, this.password.value)
    .then(() => {
      this.form.reset();
    }, error => {
      this.form.reset();
    });
  }

  from() {
    console.log('enter key is working');
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    if (this.platform.is('ios')) {
      this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
    } else {
      this.passwordIcon = this.passwordIcon === 'eye' ? 'eye-off' : 'eye';
    }
  }

  facebookLogin() {
    this.router.navigate(['/auth'])
  }

}
