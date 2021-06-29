import { DirectionsService } from './../../core/services/directions.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ShopService } from '@app/core/services/shop.service';
import { TransactionDetailsPage } from '@app/shared/pages/transaction-details/transaction-details.page';
import { ModalController, AlertController } from '@ionic/angular';
import { TransactionStatus } from '@app/core/constants/transaction-status';
import { TransactionService } from '@app/core/services/transaction.service';
import { ToastService } from '@app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shop-transactions',
  templateUrl: './shop-transactions.page.html',
  styleUrls: ['./shop-transactions.page.scss'],
})
export class ShopTransactionsPage implements OnInit {
  type: 'all' | 'credit' | 'debit' | 'refill' | 'buy' = 'all';
  loading = false;
  transactionsLoaded = false;
  allTransactionsOfCurrentShop = [];
  creditTransactionsOfCurrentShop = [];
  debitTransactionsOfCurrentShop = [];
  refillTransactionsOfCurrentShop = [];
  buyTransactionsOfCurrentShop = [];

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private modalController: ModalController,
              private zone: NgZone,
              private DirectionsService: DirectionsService,
              private toastService: ToastService,
              private transactionService: TransactionService,
              private alertController: AlertController,
              private translate: TranslateService,
              private shopService: ShopService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.getShopAllTransactions(params.id);
   });
  }
  async handleTransactionClick(transaction) {
    if (transaction.status === TransactionStatus.PENDING) {
      const alert = await this.alertController.create({
        header: 'Change Stauts!',
        message: 'Please select the action you want to perform on this transaction.',
        buttons: [
          {
            text: 'Accept',
            cssClass: 'success',
            handler: () => {
              this.loading = true;
              this.transactionService.changeBuyStatus({transactionId: transaction.id, isAccepted: true})
              .subscribe(() => {
                this.zone.run(() => this.loading = false);
                this.translate.get('PAGE_TRANSACTION_MSG_TRANSACTION_ACCEPTED').subscribe(res => {
                  this.toastService.presentToast(res);
                });
                // this.toastService.presentToast('Transaction was accepted');
              }, error => {
                this.zone.run(() => this.loading = false);
                console.error(error);
                this.translate.get('PAGE_TRANSACTION_MSG_TRANSACTION_REJECTED').subscribe(res => {
                  this.toastService.presentToast(res);
                });
                this.toastService.presentToast(error.message);
              });
            }
          }, {
            text: 'Reject',
            cssClass: 'danger',
            handler: () => {
              this.loading = true;
              this.transactionService.changeBuyStatus({transactionId: transaction.id, isRejected: true})
              .subscribe(() => {
                this.translate.get('PAGE_VERIFY_EMAIL_MSG').subscribe(res => {
                  this.toastService.presentToast(res);
                });
                // this.toastService.presentToast('You rejected the transaction');
                this.zone.run(() => this.loading = false);
              }, error => {
                this.zone.run(() => this.loading = false);
                console.error(error);
                this.toastService.presentToast(error.message);
              });
            }
          }, {
            text: 'View Details',
            handler: () => {
              this.viewTransactionDetails(transaction.id);
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });


      this.translation(alert);
    } else {
      this.viewTransactionDetails(transaction.id);
    }
  }
  async translation(alert){
    this.translate.get('PAGE_TRANSACTION_HEADER').subscribe(res => {
      console.log(res);
      alert.header = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('PAGE_TRANSACTION_MESSAGE').subscribe(res => {
      // console.log(res);
      alert.message = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('PAGE_TRANSACTION_TEXT_ACCEPT').subscribe(res => {
      // console.log(res);
      (alert.buttons[0] as any).text = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('PAGE_TRANSACTION_TEXT_REJECT').subscribe(res => {
      // console.log(res);
      (alert.buttons[1] as any).text = res;

     } );
    this.translate.get('PAGE_TRANSACTION_TEXT_VIEW_DETAILS').subscribe(res => {
      // console.log(res);
      (alert.buttons[2] as any).text = res;

     } );
    this.translate.get('PAGE_TRANSACTION_TEXT_CANCEL').subscribe(res => {
      // console.log(res);
      (alert.buttons[3] as any).text = res;

     } );
    await alert.present();
}
  getShopAllTransactions(shopId) {
    this.loading = true;
    this.shopService.getShopTransactions(shopId, this.authService.currentUserId).subscribe((transactions) => {
      
      this.transactionsLoaded = true;
      console.log(transactions);
      this.allTransactionsOfCurrentShop = transactions;
      if(this.transactionsLoaded){

      
      for(let i=0;i<this.allTransactionsOfCurrentShop.length;i++)
      {
        console.log(i);
        if(this.allTransactionsOfCurrentShop[i].reason=='buy'){
          this.buyTransactionsOfCurrentShop.push(this.allTransactionsOfCurrentShop[i]);
        }
        if(this.allTransactionsOfCurrentShop[i].reason=='refill'){
          this.refillTransactionsOfCurrentShop.push(this.allTransactionsOfCurrentShop[i]);
        }
        if(this.allTransactionsOfCurrentShop[i].type=='credit'){
          this.creditTransactionsOfCurrentShop.push(this.allTransactionsOfCurrentShop[i]);
        }
        if(this.allTransactionsOfCurrentShop[i].type=='debit'){
          this.debitTransactionsOfCurrentShop.push(this.allTransactionsOfCurrentShop[i]);
        }

      }
      console.log("debit transactions are" , this.debitTransactionsOfCurrentShop);
      console.log("credit transactions are" , this.creditTransactionsOfCurrentShop);
      console.log("refill transactions are" , this.refillTransactionsOfCurrentShop);
      console.log("buy transactions are" , this.buyTransactionsOfCurrentShop);
    }
      this.loading = false;
    });
  }

  getDateObj(date) {
    // console.log(date);
    return date.toDate();
  }
  segmentChanged(event) {
    if (event.detail.value === 'credit' && !this.creditTransactionsOfCurrentShop) {
      this.creditTransactionsOfCurrentShop;
    } else if (event.detail.value === 'debit' && !this.debitTransactionsOfCurrentShop) {
      this.debitTransactionsOfCurrentShop;
    } else if (event.detail.value === 'refill' && !this.refillTransactionsOfCurrentShop) {
      this.refillTransactionsOfCurrentShop;
    } else {
      this.allTransactionsOfCurrentShop;
    }
  }
  getDirections(event , shopId) {
    console.log(shopId);
    event.stopPropagation();
    this.DirectionsService.getDirections(shopId);
    

    // this.modalController.dismiss();
  }
  async viewTransactionDetails(id) {

    console.log(id);
    const modal = await this.modalController.create({
      component: TransactionDetailsPage,
      cssClass: 'overlay-modal',
      backdropDismiss: true,
      componentProps: {
        transactionId: id
      },
    });
    return await modal.present();
  }

}
