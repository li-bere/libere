import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { BottleI } from '@app/core/models/bottle';
import { ToastService } from '@app/core/services/toast.service';
import { LoadingService } from '@app/core/services/loading.service';
import { BottleService } from '@app/core/services/bottle.service';
import { take } from 'rxjs/operators';
import { ModalController, Platform } from '@ionic/angular';
import { QrComponent } from '@app/shared/components/qr/qr.component';


@Component({
  selector: 'app-bottles',
  templateUrl: './bottles.page.html',
  styleUrls: ['./bottles.page.scss'],
})
export class BottlesPage implements OnInit {

  bottles: BottleI[];

  constructor(
    private router: Router,
    private toastService: ToastService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private bottleService: BottleService,
    private translate: TranslateService,
    private platform: Platform
  ) { }

  async ngOnInit() {
    const loadingText = await this.translate.get('LOADING').pipe(take(1)).toPromise();
      await this.loadingService.presentLoading(loadingText);
    // await this.loadingService.presentLoading('Loading...');
    this.bottleService.getBottles().subscribe(async (bottles) => {
      console.log(bottles);
      this.bottles = bottles;
      await this.loadingService.dismissLoader();
    }, async error => {
      console.error(error);
      await this.loadingService.dismissLoader();
      this.toastService.presentToast(error.message);
    });
    this.initializeBackButton();
  }
  
  async botles(serial){
    console.log(serial);
    this.present(serial);

  //   const modal = await this.modalController.create({
  //     component: BottleQRComponent,
  //     cssClass: 'overlay-modal',
  //     backdropDismiss: true,
  //     componentProps: {
  //       libereSerial: serial
  //     },
  //   });
  //   return await modal.present();
  }
  async present(libereSerial){
    
    const modal = await this.modalController.create({
      component: QrComponent,
      cssClass: 'overlay-modal',
      componentProps: {
        shopSid: libereSerial
      }
    });
    return await modal.present();
  
}

initializeBackButton() {
  this.platform.backButton.subscribeWithPriority(-1, async (res) => {
    console.log(res);
    this.router.navigate(['/user-tabs/home']);
  });
}

}
