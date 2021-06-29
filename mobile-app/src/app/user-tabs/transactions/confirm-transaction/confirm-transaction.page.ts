import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionTypes } from '@app/core/constants/transaction-type';
import { FeeI } from '@app/core/models/fee';
import { QuotaI } from '@app/core/models/quota';
import { ShopI } from '@app/core/models/shop';
import { AuthService } from '@app/core/services/auth.service';
import { FeeService } from '@app/core/services/fee.service';
import { QuotaService } from '@app/core/services/quota.service';
import { ShopService } from '@app/core/services/shop.service';
import { ToastService } from '@app/core/services/toast.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { UserService } from '@app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.page.html',
  styleUrls: ['./confirm-transaction.page.scss'],
})
export class ConfirmTransactionPage implements OnInit {

  shop: ShopI;
  loading = false;
  credit: number;
  creditLoading = false;
  shopSID: any;
  creditsOfShop: number;
  transactionTime: any;
  currentTime = new Date(Date.now());
  creditsOfUser: any;
  private shopSub: any;
  private creditSub: any;
  transactionTypes = TransactionTypes;
  currentTransactionData: any;

  paramsResult: any;

  constructor(private activatedRoute: ActivatedRoute,
    private zone: NgZone,
    private toastService: ToastService,
    private authService: AuthService,
    private shopService: ShopService,
    private transactionService: TransactionService,
    private quotaService: QuotaService,
    private feeService: FeeService,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(result => {
      console.log(result);
      this.paramsResult = result;
    });

    this.loading = true;
    this.shopSub = this.shopService.getShopBySid(this.paramsResult.id.toLowerCase()).subscribe(
      (shop: Array<ShopI>) => {
        this.shopSID = shop[0];
        console.log(this.shopSID);
        this.creditsOfShop = this.shopSID.credit;
        console.log(this.currentTime);
        if (shop.length < 1) {
          this.translate.get('PAGE_CONFIRM_NO_SHOP_EXIST_WITH_ID').subscribe(res => {
            this.toastService.presentToast(res);
          });
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
      this.paramsResult.type === TransactionTypes.REFILL
        ? this.feeService.getFee('bottle-refill')
        : this.quotaService.getQuota('buy');
    this.creditSub = creditRef.subscribe(
      (creditObj: FeeI | QuotaI) => {
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

  }





  confirmTransaction() {
    let type= this.paramsResult.type
    
      if (type=="BUY" && this.creditsOfShop < 10) {
        this.translate.get('PAGE_CONFIRM_SHOP_NO_CREDIT').subscribe(res => {
          this.toastService.presentToast(res);
        });
        // this.toastService.presentToast('Shop has no credits.');
      }
    
     else {
      this.loading = true;
      const data = {
        shopId: this.shop.id,
        uid: this.authService.currentUserId,
        shopkeeperUid: this.shop.shopkeeperUid,
        shopColor: this.shopSID.color
      };
      console.log(data);
      const transactionRef =
        this.paramsResult.type === TransactionTypes.REFILL
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
            // this.modalCtrl.dismiss({ status: 1 });
            this.router.navigate(['/user-tabs/transactions']);
          });
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

  back() {
    this.router.navigate(['/user-tabs/transactions/add']);
  }

}
