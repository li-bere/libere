import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { AlertService } from '@app/core/services/alert.service';
import { ToastService } from '@app/core/services/toast.service';
import { ShopService } from '@app/core/services/shop.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {

  latLng = { lat: 0, lng: 0 };
  address = { location: '', city: '', state: '', zip: '', latLng: this.latLng };
  formValue = { name: '', address: this.address, phone: '', isFountain: false };
  form: FormGroup;
  loading = false;

  id: string;
  private pathParamSub: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private toastService: ToastService,
    private shopService: ShopService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.formValue.name, [Validators.required]),
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
      phone: new FormControl(this.formValue.phone, [Validators.required]),
      isFountain: new FormControl(this.formValue.isFountain, [
        Validators.required,
      ]),
    });

    this.loading = true;
    this.pathParamSub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.getShop();
   });
  }

  get name() {
    return this.form.get('name');
  }
  get phone() {
    return this.form.get('phone');
  }
  get isFountain() {
    return this.form.get('isFountain');
  }

  async onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.loading = true;
      try {
        await this.shopService.editShop(this.id, this.form.value);
        this.translate.get('PAGE_EDIT_MSG_SHOP_UPDATED_SUCCESSFULL').subscribe(res => {
          this.toastService.presentToast(res);
        });
        // this.toastService.presentToast('Shop updated Successfully');
        this.loading = false;
        this.router.navigate(['/shopkeeper-tabs/shops']);
      } catch (error) {
        console.error(error);
        this.alertService.errorAlert(error.message);
        this.loading = false;
      }
    }
  }

  getShop() {
    this.shopService.getShop(this.id).subscribe((shop) => {
      this.form.patchValue(shop);
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.translate.get('PAGE_EDIT_ERROR_MSG_ERROR_SHOP_DATA').subscribe(res => {
        this.toastService.presentToast(res);
      });
      // this.toastService.presentToast('Error getting shop data.');
    });
  }

  ngOnDestroy() {
    this.pathParamSub.unsubscribe();
  }

}
