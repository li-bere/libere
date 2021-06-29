import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ShopI } from '@app/core/models/shop';
import { FeeI } from '@app/core/models/fee';
import { QuotaI } from '@app/core/models/quota';
import { ToastService } from '@app/core/services/toast.service';
import { AuthService } from '@app/core/services/auth.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { ShopService } from '@app/core/services/shop.service';
import { FeeService } from '@app/core/services/fee.service';
import { QuotaService } from '@app/core/services/quota.service';
import { TransactionTypes } from '@app/core/constants/transaction-type';
// import { firestore } from 'firebase';
import firebase from 'firebase';
import { UserService } from '@app/core/services/user.service';
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit, OnDestroy {
  @Input() shopSid: string;
  @Input() type: string;
  @Input() coordinates: any;
  shop: ShopI;
  loading = false;
  credit: number;
  creditLoading = false;
  shopSID: any;
  creditsOfShop: number;
  transactionTime: any;
  currentTime = new Date(Date.now());
  creditsOfUser: any;
  nearshop=false;
  private shopSub: any;
  private creditSub: any;
  transactionTypes = TransactionTypes;
  currentTransactionData: any;
  userLat;
  userLng;
  shopLat;
  shopLng;
  constructor(
    private zone: NgZone,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private authService: AuthService,
    private shopService: ShopService,
    private transactionService: TransactionService,
    private quotaService: QuotaService,
    private feeService: FeeService,
    private userService: UserService,
    private translate: TranslateService,
    private platform: Platform
  ) {}
  ngOnInit() {
    this.loading = true;
    console.log(this.coordinates.coords.latitude);
    console.log(this.coordinates.coords.longitude);

    this.userLat=this.coordinates.coords.latitude;
    this.userLng=this.coordinates.coords.longitude;
    // this.userLat=41.2906327;
    // this.userLng=13.5321260;
    console.log(this.coordinates.coords.longitude);
    this.shopSub = this.shopService.getShopBySid(this.shopSid.toLowerCase()).subscribe(
      (shop: Array<ShopI>) => {
        this.shopSID = shop[0];
        console.log(this.shopSID);
        this.shopLat=shop[0].address.latLng.lat;
        this.shopLng=shop[0].address.latLng.lng;
        // this.userLat=41.940264;
        // this.userLng=12.423278;
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((this.userLat-this.shopLat) * p) / 2 + c(this.shopLat * p) *c((this.userLat) * p) * (1 - c(((this.userLng- this.shopLng) * p))) / 2;
        let dis = (12742 * Math.asin(Math.sqrt(a)));
        dis=dis*1000; // 2 * R; R = 6371 km
        console.log(dis);
        if(dis>=20){
          this.nearshop=true;
        }
        console.log(this.nearshop);
      
        this.creditsOfShop = this.shopSID.credit;
        console.log(this.currentTime);
        if (shop.length < 1) {
          this.translate.get('PAGE_CONFIRM_NO_SHOP_EXIST_WITH_ID').subscribe(res => {
            this.toastService.presentToast(res);
          });
          // this.toastService.presentToast('No shop exists with this id.');
          this.back();
          return;
        }
        this.shop = shop[0];
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
    this.creditLoading = true;
    const creditRef =
      this.type === TransactionTypes.REFILL
        ? this.feeService.getFee('bottle-refill')
        : this.quotaService.getQuota('buy');
    this.creditSub = creditRef.subscribe(
      (creditObj: FeeI | QuotaI) => {
        // console.log(creditObj);
        this.credit = creditObj.value;
        this.creditLoading = false;
      },
      (error) => {
        this.zone.run(() => {
          this.creditLoading = false;
        });
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
    // this.transactionService.getLastTransaction().subscribe(res => {
    //   console.log(res[0]);
    //   this.getDateObj(res[0].createdAt);
    // });
  }
  // getDateObj(date) {
  //   // console.log(date);
  //   console.log(date.toDate());
  //   this.getDiff(date.toDate()) ;
  // }
  // getDiff(date){
  //   console.log(date.getTime());
  //   console.log(this.currentTime.getTime());
  //   const diff = this.currentTime.getTime() - date.getTime();
  //   if (diff > 3600000){
  //     console.log('bottle can be purchased');
  //     return true;
  //   }
  //   else{
  //     console.log("your already purchased a bottle try after an hour");
  //     return false
  //   }
  // }
  confirmTransaction() {
    console.log( this.nearshop);
    if(this.nearshop){
      if (this.creditsOfShop === 0 ) {
        this.translate.get('PAGE_CONFIRM_SHOP_NO_CREDIT').subscribe(res => {
          this.toastService.presentToast(res);
        });
        // this.toastService.presentToast('Shop has no credits.');
      } else {
        this.loading = true;
        const data = {
          shopId: this.shop.id,
          uid: this.authService.currentUserId,
          shopkeeperUid: this.shop.shopkeeperUid,
          shopColor: this.shopSID.color
        };
        console.log(data);
        const transactionRef =
          this.type === TransactionTypes.REFILL
            ? this.transactionService.refillBottle(data)
            : this.transactionService.buy(data);
        transactionRef.subscribe(
          (res) => {
            console.log(res);
            this.loading = false;
            // console.log(this.loading);
            // console.log(res);
            this.translate.get('PAGE_CONFIRM_TRANSACTION_SUCCESSFULL').subscribe(ress => {
              this.toastService.presentToast(ress);
              this.modalCtrl.dismiss({ status: 1 });
            });
            // this.toastService.presentToast(
            //   'Transaction Successfull.'
            // );
            
            // this.toastService.presentToast(
            //   'Transaction Successfull.'
            // );
            // event.stopPropagation();
            // this.modalCtrl.dismiss({ status: 1 });
  
          //   if (this.type === TransactionTypes.REFILL) {
          //     this.transactionService.getCurrentlyCreatedRefillTransaction().subscribe(result => {
          //       console.log(result[0]);
          //       const currentTransaction = result[0];
          //       this.modalCtrl.dismiss({ status: 1, currentTransaction });
          //     });
          // } if (this.type === TransactionTypes.BUY) {
          //     this.transactionService.getCurrentlyCreatedBuyTransaction().subscribe(result => {
          //       console.log(result[0]);
          //       const currentTransaction = result[0];
          //       this.modalCtrl.dismiss({ status: 1, currentTransaction });
          //     });
          //   }
          },
          (error) => {
            this.zone.run(() => {
              this.loading = false;
            });
            console.error(error);
            this.toastService.presentToast(error.message);
          }
        );
      }  
    }
    else{
      this.toastService.presentToast('You must be within the limit of 20 meters to make any transaction')
    }
    
  }
  back() {
    this.modalCtrl.dismiss(null);
  }
  ngOnDestroy() {
    this.creditSub.unsubscribe();
    this.shopSub.unsubscribe();
  }
}