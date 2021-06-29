import { ModalController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
const { Keyboard } = Plugins;


import { matchPasswordValidator} from '@app/auth/shared/match-password.validator';
import { AuthService } from '@app/core/services/auth.service';
import { AlertService } from '@app/core/services/alert.service';
import { TransactionDetailsPage } from '@app/shared/pages/transaction-details/transaction-details.page';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formValue = {email: '', password: '', confirmPassword: ''};
  form: FormGroup;

  passwordType = 'password';
  passwordIcon = 'eye';

  constructor(
    private platform: Platform,
    private router: Router,
    private alertService: AlertService,
    private modalController: ModalController,
    private authService: AuthService
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
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/),
        Validators.minLength(8),
        Validators.maxLength(100)
      ]),
    
   
      confirmPassword: new FormControl(this.formValue.password, [
        Validators.required
      ]),
    }, {
      validators: matchPasswordValidator
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  async onSubmit() {
    console.log(this.form.value);
    this.authService.register(this.form.value);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    if (this.platform.is('ios')) {
      this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
    } else {
      this.passwordIcon = this.passwordIcon === 'eye' ? 'eye-off' : 'eye';
    }
  }
  async policy(){
     console.log("this is my policy");
    
     const modal = await this.modalController.create({
       component: TermsAndConditionsComponent,
       cssClass: 'overlay-modal',
       backdropDismiss: true,
      //  componentProps: {
      //    transactionId: 123
      //  },
     });
     return await modal.present();
  }

}
