import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { matchPasswordValidator } from '@app/auth/shared/match-password.validator';
import { ToastService } from '@app/core/services/toast.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  emailFormValue = { email: this.authService.currentUser.email, password: '' };
  emailForm: FormGroup;
  emailFormLoading = false;
  emailPasswordType = 'password';
  emailPasswordIcon = 'eye';

  passwordFormValue = { oldPassword: '', password: '', confirmPassword: '' };
  passwordForm: FormGroup;
  passwordFormLoading = false;
  oldPasswordType = 'password';
  oldPasswordIcon = 'eye';
  newPasswordType = 'password';
  newPasswordIcon = 'eye';

  constructor(
    private platform: Platform,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.platform.is('ios')) {
      this.emailPasswordIcon = this.emailPasswordIcon + '-outline';
      this.oldPasswordIcon = this.oldPasswordIcon + '-outline';
      this.newPasswordIcon = this.newPasswordIcon + '-outline';
    }
    this.emailForm = new FormGroup({
      email: new FormControl(this.emailFormValue.email, [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
      ]),
      password: new FormControl(this.emailFormValue.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/)
      ]),
    });

    this.passwordForm = new FormGroup(
      {
        oldPassword: new FormControl(this.passwordFormValue.oldPassword, [
          Validators.required,
        ]),
        password: new FormControl(this.passwordFormValue.password, [
          Validators.required,
          // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/),
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
        confirmPassword: new FormControl(
          this.passwordFormValue.confirmPassword,
          [Validators.required]
        ),
      },
      {
        validators: matchPasswordValidator,
      }
    );
  }

  get email() {
    return this.emailForm.get('email');
  }
  get emailPassword() {
    return this.emailForm.get('password');
  }

  get oldPassword() {
    return this.passwordForm.get('oldPassword');
  }
  get password() {
    return this.passwordForm.get('password');
  }
  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  onEmailSubmit() {
    console.log(this.emailForm.value);
    if (this.emailForm.valid) {
      this.emailFormLoading = true;
      this.authService
        .updateEmail(this.emailForm.value.email, this.emailForm.value.password)
        .then(
          () => {
            this.translate.get('PAGE_SETTING_MSG_EMAIL_UPDATE_SUCCESS').subscribe(res => {

              this.toastService.presentToast(res);
            });
            // this.toastService.presentToast(
            //   'Email has been updated sucessfully'
            // );
            this.emailFormLoading = false;
            this.router.navigate(['verify-email']);
          },
          (error) => {
            console.error(error);
            this.emailFormLoading = false;
            this.toastService.presentToast(error.message);
          }
        );
    }
  }

  onPasswordSubmit() {
    console.log(this.passwordForm.value);
    if (this.passwordForm.valid) {
      this.passwordFormLoading = true;
      this.authService
        .updatePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.password)
        .then(
          () => {
            this.translate.get('PAGE_SETTING_MSG_PASSWORD_UPDATE_SUCCESS').subscribe(res => {
              this.toastService.presentToast(res);
            });
            // this.toastService.presentToast(
            //   'Password has been updated sucessfully'
            // );
            this.passwordForm.reset();
            this.passwordFormLoading = false;
          },
          (error) => {
            console.error(error);
            this.passwordFormLoading = false;
            this.toastService.presentToast(error.message);
          }
        );
    }
  }

  hideShowEmailPassword() {
    this.emailPasswordType = this.emailPasswordType === 'text' ? 'password' : 'text';
    if (this.platform.is('ios')) {
      this.emailPasswordIcon = this.emailPasswordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
    } else {
      this.emailPasswordIcon = this.emailPasswordIcon === 'eye' ? 'eye-off' : 'eye';
    }
  }

  hideShowOldPassword() {
    this.oldPasswordType = this.oldPasswordType === 'text' ? 'password' : 'text';
    if (this.platform.is('ios')) {
      this.oldPasswordIcon = this.oldPasswordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
    } else {
      this.oldPasswordIcon = this.oldPasswordIcon === 'eye' ? 'eye-off' : 'eye';
    }
  }

  hideShowNewPassword() {
    this.newPasswordType = this.newPasswordType === 'text' ? 'password' : 'text';
    if (this.platform.is('ios')) {
      this.newPasswordIcon = this.newPasswordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
    } else {
      this.newPasswordIcon = this.newPasswordIcon === 'eye' ? 'eye-off' : 'eye';
    }
  }

}
