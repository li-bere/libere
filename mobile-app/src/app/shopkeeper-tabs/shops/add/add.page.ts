import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { IonIntlTelInputValidators } from 'ion-intl-tel-input';

import { AlertService } from '@app/core/services/alert.service';
import { ToastService } from '@app/core/services/toast.service';
import { ShopService } from '@app/core/services/shop.service';
import { AnyMxRecord } from 'dns';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  latLng = { lat: 0, lng: 0 };
  address = { location: '', city: '', state: '', zip: '', latLng: this.latLng };
  formValue = { name: '', sid: '', address: this.address, phone: '', isFountain: false };
  form: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private toastService: ToastService,
    private shopService: ShopService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.formValue.name, [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]*'),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      sid: new FormControl(this.formValue.sid, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/)
      ]),
      address: new FormGroup({
        location: new FormControl(this.formValue.address.location, [
          Validators.compose([Validators.required]),
        ]),
        city: new FormControl(this.formValue.address.city, [
          Validators.compose([Validators.required]),
        ]),
        state: new FormControl(this.formValue.address.state, [
          Validators.compose([Validators.required]),
        ]),
        zip: new FormControl(this.formValue.address.zip, [
          Validators.compose([Validators.required]),
        ]),
        latLng: new FormGroup({
          lat: new FormControl(this.formValue.address.latLng.lat, [
            Validators.compose([Validators.required]),
          ]),
          lng: new FormControl(this.formValue.address.latLng.lng, [
            Validators.compose([Validators.required]),
          ]),
        }),
      }),
      phone: new FormControl(this.formValue.phone, [
        IonIntlTelInputValidators.phone
      ]),
      isFountain: new FormControl(this.formValue.isFountain, [
        Validators.required,
      ]),
    });
  }

  get name() {
    return this.form.get('name');
  }
  get sid() {
    return this.form.get('sid');
  }
  get phone() {
    return this.form.get('phone');
  }
  get isFountain() {
    return this.form.get('isFountain');
  }
  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
    }

  async onSubmit() {
    let existShop : any;
    // console.log(this.form.value.address.latLng);
    this.shopService.getShoplatLng(this.form.value.address.latLng).pipe(take(1))
    .subscribe(async res=>{
      console.log(res);
      console.log(res.length);
      existShop=res.length;
      console.log(existShop);
      if(existShop>0){
      
        this.toastService.presentToast("shop already exist on this location");
      }
      else {
   
  
      const shopId = this.form.value.sid;
      this.form.value.sid = shopId.toLowerCase();
      const color = this.getRandomColor();
      const form = {color, ...this.form.value};
      const data = {shopId, ... form};
      console.log(data);
      if (this.form.valid) {
        if (this.form.value.address.latLng.lat === 0 || this.form.value.address.latLng.lng === 0) {
          this.translate.get('PAGE_ADD_ERROR').subscribe(res => {
            this.alertService.error(res);
            // this.userAppPages[0].title = res;
          });
          // this.alertService.error('You must select a location on the map after clicking on it.');
          return;
        }
        this.loading = true;
        try {
          await this.shopService.createShop(data);
          this.translate.get('PAGE_ADD_MSG_SHOP_REGISTER_SUCCESSFULL').subscribe(res => {
            this.toastService.presentToast(res);
            this.form.reset();
          });
          // this.toastService.presentToast('Shop Registered Successfully');
          this.loading = false;
          this.router.navigate(['/shopkeeper-tabs/shops']);
        } catch (error) {
          console.error(error);
          this.alertService.errorAlert(error.message);
          this.loading = false;
        }
      } else {
        this.form.markAllAsTouched();
      }
    }
  
    })
   
     }

}
