import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { timer, Subject,  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

import { environment } from '@environments/environment';

import { AuthService } from '@app/core/services/auth.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  disableResend = false;
  showTimer = false;

  verificationEmailInterval = environment.emailResendConfig.emailResendIntervalInitial;
  timeLeft = this.verificationEmailInterval;

  user: firebase.User;
  email: any;
  private componetDestroyed: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.authService.currentUserObservable
    .subscribe(user => {
      this.user = user;
      console.log(this.user.email);
      this.email=this.user.email;
    });
    
    
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
    this.authService.sendVerificationEmail(true)
    .then(() => {
      this.translate.get('PAGE_VERIFY_EMAIL_MSG').subscribe(res => {
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
    this.router.navigate(['/auth/login']);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    this.cleanUpTimer();
  }

}
