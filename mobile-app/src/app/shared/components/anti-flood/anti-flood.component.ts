import { ToastService } from './../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-anti-flood',
  templateUrl: './anti-flood.component.html',
  styleUrls: ['./anti-flood.component.scss'],
})
export class AntiFloodComponent implements OnInit {
  disableResend = false;
  showTimer = false;

  verificationEmailInterval = environment.emailResendConfig.emailResendIntervalInitial;
  timeLeft = this.verificationEmailInterval;
  private componetDestroyed: Subject<void> = new Subject();
  user: firebase.User;
  email: any;
  constructor(private authService: AuthService,
              private translate: TranslateService,
              private toastService: ToastService) { }

  ngOnInit() {}
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
  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    this.cleanUpTimer();
  }

}
