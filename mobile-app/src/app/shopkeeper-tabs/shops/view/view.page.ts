import { shopRankingI } from './../../../core/models/shopRank';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Plugins, FilesystemDirectory, CameraSource, CameraResultType } from '@capacitor/core';
const { Filesystem } = Plugins;
const { Camera } = Plugins;

import { ShopI } from '@app/core/models/shop';
import { TransactionI } from '@app/core/models/transaction';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/core/services/user.service';
import { ShopService } from '@app/core/services/shop.service';
import { TransactionService } from '@app/core/services/transaction.service';

import { LocationViewComponent } from '@app/shared/components/location-view/location-view.component';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ImageCroppingComponent } from '@app/shared/components/image-cropping/image-cropping.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit, OnDestroy {

  @ViewChild(LocationViewComponent) private locationViewComponent: LocationViewComponent;
  @ViewChild('canvas') private canvasElement: HTMLCanvasElement;

  id: string;
  private pathParamSub: any;
  isFountain: boolean;
  type = 'shop';
  pla;
  co2;
  shop: ShopI;
  refillTransactions: Array<TransactionI>;
  loading = false;
  photoLoading = false;

  qrData = '';
  qrCodeOptions = {
    elementType: 'canvas',
    scale: 8
  };
  qrDownloadBtnDisabled = true;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private userService: UserService,
    private shopService: ShopService,
    private transactionService: TransactionService,
    private translate: TranslateService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loading = true;
    this.pathParamSub = this.route.params.subscribe(params => {
      this.id = params.id;
       console.log(this.id);
      this.getShop();
      this.getRanking();
   });
  
  }

  ionViewDidEnter() {
    this.locationViewComponent.initialize();
  }

  getShop() {
    this.shopService.getShop(this.id).subscribe((shop: ShopI) => {
      this.shop = shop;
      console.log(this.shop.isFountain);
      this.getUser();
    }, error => {
      console.error(error);
      this.loading = false;
      this.translate.get('PAGE_VIEW_ERROR_MSG_ERROR_SHOP_DATA').subscribe(res => {
        this.toastService.presentToast(res);
      });
      // this.toastService.presentToast('Error getting shop data.');
    });
  }
  getRanking(){
    this.shopService.getstats(this.id).subscribe((res:shopRankingI)=>{
      this.co2=res.totalco2;
      this.pla=res.totalpla2;
    })
  }
    getUser() {
    this.userService.getUser().subscribe((user) => {
      this.isFountain=this.shop.isFountain;
      const data = {
        shopSid: this.shop.sid,
        type: 'shop'
      };
      this.qrData = JSON.stringify(data);
      this.qrDownloadBtnDisabled = false;
      this.getRefills();
    },
    (error) => {
      this.loading = false;
      console.error(error);
      this.toastService.presentToast(error.message);
    });
  }

  getRefills() {
    this.loading = true;
    this.transactionService.getTransactions('credit', 'refill', null, this.id).subscribe(
      (transactions: Array<TransactionI>) => {
        console.log(transactions);
        this.refillTransactions = transactions;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
  }

  async downloadQRCode() {
    console.log(this.canvasElement);
    this.loading = true;
    try {
      const imgData = await this.canvasElement.toDataURL('image/jpeg');
      console.log(imgData);
      const data = imgData.split(',')[1];

      const fileName = 'libere-qr-code-' + new Date().getTime() + '.jpeg';
      await Filesystem.writeFile({
        data,
        path: fileName,
        directory: FilesystemDirectory.Documents,
      });

      console.log(FilesystemDirectory.Documents);
      console.log(FilesystemDirectory.ExternalStorage);

      this.loading = false;
      this.toastService.presentToast(
        'Your qr code has been saved in the gallery.'
      );
    } catch (error) {
      console.error(error);
      this.loading = false;
      this.translate.get('PAGE_VIEW_ERROR_MSG_ERROR_QR_CODE').subscribe(res => {
        this.toastService.presentToast(res);
      });
      // this.toastService.presentToast('Could not save the qr code');
    }
  }

  openRefillTab() {
    this.type = 'refills';
  }

  ngOnDestroy() {
    this.pathParamSub.unsubscribe();
  }

  goToAllRatingsPage() {
    console.log(this.id);
    this.router.navigate(['/ratings'], { queryParams: { id: this.id } });
  }

  gotoShopsTransactionsPage(shopId) {
    console.log(shopId);
    this.router.navigate(['/shop-transactions'], { queryParams: { id: shopId } });
  }







  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePhoto();
          },
        },
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            console.log('Gallery clicked');
            this.selectPhoto();
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async takePhoto(): Promise<void> {
    this.photoLoading = true;
    const photo = await this.getPhoto(CameraSource.Camera);
    if (photo) {
      console.log(photo);
      this.openImageCropper(photo).then((croppedImageBase64) => {
        console.log(croppedImageBase64);
      });
      // try {
      //   // await this.userService.saveUserDisplayPhoto(photo);
      //   await this.shopService.saveShopDisplayPhoto(this.id, photo);
      //   this.photoLoading = false;
      // } catch (error) {
      //   this.photoLoading = false;
      //   console.error(JSON.stringify(error));
      // }
    }
    this.photoLoading = false;
  }

  async selectPhoto(): Promise<void> {
    this.photoLoading = true;
    const photo = await this.getPhoto(CameraSource.Photos);
    if (photo) {
      console.log(photo);
      this.openImageCropper(photo).then((croppedImageBase64) => {
        console.log(croppedImageBase64);
      });
      // try {
      //   // await this.userService.saveUserDisplayPhoto(photo);
      //   await this.shopService.saveShopDisplayPhoto(this.id, photo);
      //   this.photoLoading = false;
      // } catch (error) {
      //   this.photoLoading = false;
      //   console.error(error);
      // }
    }
    this.photoLoading = false;
  }

  private async getPhoto(source: CameraSource): Promise<string | undefined> {
    const image = await Camera.getPhoto({
      quality: 10,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source,
    });

    return image.dataUrl;
  }
  
  async openImageCropper(photoBase64) {
    const modal = await this.modalController.create({
      component: ImageCroppingComponent,
      cssClass: 'overlay-modal',
      // backdropDismiss: true,
      componentProps: {
        base64OfProfileImage: photoBase64
      },
    });
    modal.onDidDismiss().then(async (data) => {
      console.log(data.data);
      let base64StringFromCropper = data.data;
      console.log(base64StringFromCropper.split(','));
      let base64StringSet = base64StringFromCropper.split(',');

        try {
          this.photoLoading = true;
          await this.shopService.saveShopDisplayPhoto(this.id, base64StringSet[1]);
          this.photoLoading = false;
        } catch (error) {
          this.photoLoading = false;
          console.error(error);
        }
    });
    return await modal.present();
  }





}
