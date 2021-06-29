import { AuthService } from './../../core/services/auth.service';
import { QrComponent } from '../../shared/components/qr/qr.component';
import { ShopI } from '@app/core/models/shop';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastService } from '@app/core/services/toast.service';
import { ShopService } from '@app/core/services/shop.service';
import { ModalController } from '@ionic/angular';

// import { LocationViewComponent } from '@app/shared/components/location-view/location-view.component';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})
export class ShopsPage implements OnInit {

  // @ViewChildren(LocationViewComponent) private locationViewComponents: QueryList<LocationViewComponent>;

  loading = false;
  shops: Array<ShopI>;
  email;
  constructor(
    private router: Router,
    private toastService: ToastService,
    private shopService: ShopService,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(async user=>{
      await user.reload();
      this.email=user.emailVerified;
    })
    this.loading = true;
    this.shopService.getShops().subscribe((shops: Array<ShopI>) => {
      this.shops = shops;
      this.loading = false;
      console.log(this.shops);
    }, (error) => {
      console.error(error);
      this.toastService.presentToast(error.message);
      this.loading = false;
    });
  }

  async presentModal(id) {
    const modal = await this.modalCtrl.create({
      component: QrComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        shopSid: id
      }
    });
    return await modal.present();
  }

  /* ngAfterViewInit() {
    this.locationViewComponents.changes.subscribe(() => {
      console.log(this.locationViewComponents);
      console.log(this.locationViewComponents.toArray().length);
      this.locationViewComponents.toArray().forEach(locationViewComponent => {
        locationViewComponent.initialize();
      });
    });
  }

  trackByFunction(index, item) {
    if (!item) {
      return null;
    }
    return item.id;
  } */

  gotoAddShop() {
    if(this.email){
      this.router.navigate(['/shopkeeper-tabs/shops/add']);
    }
    else{
      this.router.navigate(['/non-verified']);
    }
   
  }

}
