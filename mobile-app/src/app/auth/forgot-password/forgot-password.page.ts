import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

import { environment } from '@environments/environment';

import { AlertService } from '@app/core/services/alert.service';
import { AuthService } from '@app/core/services/auth.service';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  formValue = {email: ''};
  form: FormGroup;
  
  disableResend = false;
  showTimer = false;
  emailSend = false;

  verificationEmailInterval = environment.emailResendConfig.emailResendIntervalInitial;
  timeLeft = this.verificationEmailInterval;

  user: firebase.User;
 
  private componetDestroyed: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(this.formValue.email, [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      ])
    });
  }

  get email() { return this.form.get('email'); }

  onSubmit() {
    console.log(this.form.value);
    this.authService.resetPassword(this.form.value.email);
    this.emailSend=true;
    // .then(() => {
    //   this.alertService.success(`An email has been sent to ${this.form.value.email} with instructions to reset the password`);
    //   this.router.navigate(['login']);
    // });
  }
  
  get timeLeftFormated() {
    return moment.utc(this.timeLeft * 1000).format('mm:ss');
  }

  startTimer() {
    const source = timer(0, 1000);
    const timerSub = source.pipe(takeUntil(this.componetDestroyed))
    .subscribe(val => {
      if (val === this.verificationEmailInterval) {
        this.showTimer = false;
        this.disableResend = false;
        timerSub.unsubscribe();

        this.verificationEmailInterval =
        this.verificationEmailInterval * 2 >  environment.emailResendConfig.maxEmailResendinterval ?
        environment.emailResendConfig.maxEmailResendinterval : this.verificationEmailInterval * 2;
      }
      this.timeLeft = this.verificationEmailInterval - val;
    });
  }

  resendEmail() {
    // translate.get('hello.world').subscribe((text:string) => {console.log(text});
    this.authService.resetPassword(this.form.value.email)
    .then(() => {
      this.translateService.get('PAGE_VERIFY_EMAIL_MSG').subscribe(res => {
        this.toastService.presentToast(res);
      });
      this.showTimer = true;
      this.startTimer();
    });
  }

  private cleanUpTimer() {
    console.log('cleanup');
    this.showTimer = false;
    this.timeLeft = this.verificationEmailInterval;
    this.componetDestroyed.next();
    this.componetDestroyed.complete();
  }

  async gotoLogin() {
    this.cleanUpTimer();
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    this.cleanUpTimer();
  }

}
