import { TranslateService } from '@ngx-translate/core';
import { take, map, debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { ToastService } from '@app/core/services/toast.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { AlertService } from '@app/core/services/alert.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  formValue = {username: '', isShopKeeper: false, referral: ''};
  form: FormGroup;
  invitedFrom: any;

  loading = false;
  allUserInvites: any;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastService: ToastService,
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private translate: TranslateService,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) { }

  // username: new FormControl(this.formValue.username, [
  //   Validators.required,
  //   Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)
  // ]),
  // isShopKeeper: new FormControl(this.formValue.isShopKeeper, [
  //   Validators.required
  // ]),
  // referral: new FormControl(this.formValue.referral, [
  //   Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)
  // ]),

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)
        ], [CustomValidator.username(this.afs)]],
      isShopKeeper: [false, [
          Validators.required
        ]],
      referral: ['', [
          Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)
        ]]
      // invitedFrom: new FormControl(this.formValue.invitedFrom, [
      //   // Validators.required
      // ])
    });

    this.userService.getAllInvitesOfCurrentUser().subscribe(res => {
      console.log(res);
      this.allUserInvites = res;
    });
  }

  get username() { return this.form.get('username'); }
  get isShopKeeper() { return this.form.get('isShopKeeper'); }
  get referral() { return this.form.get('referral'); }
  // get invitedFrom() { return this.form.get('invitedFrom'); }

  async onSubmit() {
    if (this.form.value.referral === undefined || this.form.value.referral === '' || this.form.value.referral === null) {
      let user = {
        username: this.form.value.username.toLowerCase(),
        isShopKeeper: this.form.value.isShopKeeper,
        refferal: this.form.value.referral
      };
      console.log(user);
    this.userService.addUser(user)
    .then(async () => {
      this.loading = true;
      const user = await this.userService.getUser().pipe(take(1)).toPromise();
      this.loading = false;
      if (user && user.roles.shopkeeper) {
        this.router.navigate(['shopkeeper-tabs']);
      } else {
        this.router.navigate(['user-tabs']);
      }
    }, error => {
      console.error(error);
      this.toastService.presentToast(error.message);
    });
    } else {
      let user = {
        username: this.form.value.username.toLowerCase(),
        isShopKeeper: this.form.value.isShopKeeper,
        refferal: this.form.value.referral.toLowerCase()
      };
      console.log(user);
      this.userService.addUser(user)
    .then(async () => {
      this.loading = true;
      const user = await this.userService.getUser().pipe(take(1)).toPromise();
      this.loading = false;
      if (user && user.roles.shopkeeper) {
        this.router.navigate(['shopkeeper-tabs']);
      } else {
        this.router.navigate(['user-tabs']);
      }
    }, error => {
      console.error(error);
      this.toastService.presentToast(error.message);
    });
    }


    // this.userService.addUser(user)
    // .then(async () => {
    //   this.loading = true;
    //   const user = await this.userService.getUser().pipe(take(1)).toPromise();
    //   this.loading = false;
    //   if (user && user.roles.shopkeeper) {
    //     this.router.navigate(['shopkeeper-tabs']);
    //   } else {
    //     this.router.navigate(['user-tabs']);
    //   }
    // }, error => {
    //   console.error(error);
    //   this.toastService.presentToast(error.message);
    // });
  }

  setValue(ev) {
    console.log(ev.detail.value);
    this.invitedFrom = ev.detail.value;
  }

  async signOut() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message:
        'Are you sure you want to <strong>Signout</strong> of the application?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.authService.logout();
          },
        },
      ],
    });
    this.translate.get('COMPONENT_USER_PAGE_HEADER').subscribe(res => {
      console.log(res);
      alert.header = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_USER_PAGE_MESSAGE').subscribe(res => {
      // console.log(res);
      alert.message = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_USER_PAGE_TEXT_YES').subscribe(res => {
      // console.log(res);
      (alert.buttons[1] as any).text = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_USER_PAGE_TEXT_CANCEL').subscribe(res => {
      // console.log(res);
      (alert.buttons[0] as any).text = res;
      // this.userAppPages[0].title = res;
    });
    await alert.present();
  }

}

export class CustomValidator {
  static username(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const username = control.value.toLowerCase();
      return afs.collection('users', ref =>
      ref.where('username', '==', username))
      .valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length ? {
          usernameAvailability: false
        } : null),
      )
    }
  }
}
