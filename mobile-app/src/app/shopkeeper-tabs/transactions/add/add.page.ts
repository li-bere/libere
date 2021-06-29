import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { CreditService } from '@app/core/services/credit.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  formValue = { username: '', credits: '' };
  form: FormGroup;
  loading = false;
  constructor(private authService: AuthService,
              private creditService: CreditService,
              private router: Router,
              private toastService: ToastService,
              private zone: NgZone,) {
    this.form = new FormGroup({
      username: new FormControl(this.formValue.username, [
        Validators.required
      ]),
      credits: new FormControl(this.formValue.credits, [
        Validators.required
      ])
    });
  }
  get username() {
    return this.form.get('username');
  }
  get credits() {
    return this.form.get('credits');
  }

  ngOnInit() {
  }

  onSubmit() {
    const data = {
      userName: this.form.value.username.toLowerCase(),
      credits: this.form.value.credits,
      shopkeeperId: this.authService.currentUserId
    }
    this.loading = true;
    console.log(data);
    this.creditService.transferCredits(data).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.router.navigate(['/shopkeeper-tabs/transactions']);
      this.toastService.presentToast('Funds transfered successfully');
    },(error) => {
      this.zone.run(() => {
        this.loading = false;
      })
      console.log(error);
      this.toastService.presentToast(error);
    })
  }

}
