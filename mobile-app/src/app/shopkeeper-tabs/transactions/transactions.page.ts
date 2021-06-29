import { AuthService } from './../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';

import { map } from 'rxjs/operators';

import { TransactionI } from '@app/core/models/transaction';
import { TransactionStatus } from '@app/core/constants/transaction-status';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/core/services/user.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { ViewTransactionsPage } from './view-transactions/view-transactions.page';

import { TransactionDetailsPage } from '@app/shared/pages/transaction-details/transaction-details.page';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit, OnDestroy {

  type: 'all' | 'credit' | 'debit' | 'refill' | 'buy' = 'all';
  loading = false;

  allTransactions: Array<TransactionI>;
  creditTransactions: Array<TransactionI>;
  debitTransactions: Array<TransactionI>;
  refillTransactions: Array<TransactionI>;
  buyTransactions: Array<TransactionI>;

  totalCredit = 0;
  emailVerified;
  paramsSub: any;

  transactionStatus = TransactionStatus;

  constructor(
    private router: Router,
    private zone: NgZone,
    private platform: Platform,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService,
    private userService: UserService,
    private transactionService: TransactionService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    // this.authService.currentUserObservable.subscribe((firebaseUser) => {

    //   // console.log(this.userId);

    //   if (firebaseUser.emailVerified) {
    //     this.emailVerified=true;
    //   }
    // });
  }

  ngOnInit() {
    this.getUserCredit(); 
    const state = this.route.paramMap.pipe(map(() => window.history.state));
    this.paramsSub = state.subscribe(stateData => {
      if (stateData.type) {
        this.type = stateData.type;
        let type = 'all';
        type = stateData.type && stateData.type === 'refill' ? 'credit' : stateData.type;
        type = stateData.type && stateData.type === 'buy' ? 'debit' : stateData.type;
        const reason = stateData.reason ? stateData.reason : null;
        this.getTransactions(type, reason);
      } else{
        this.getTransactions();
      
      }
      });
    
  }
  email(){
    let email=""
    this.platform.ready().then(() => {
      open('mailto:'+email);
  });
  }

  getTransactions(type = null, reason = null) {
    this.loading = true;
    /* this.totalCredit = 0; */
    this.transactionService.getTransactions(type, reason).subscribe(
      (transactions: Array<TransactionI>) => {
        console.log(transactions);
        if (type === 'credit' && reason !== 'refill') {
          this.creditTransactions = transactions;
        }  else if (type === 'credit' && reason === 'refill') {
          this.refillTransactions = transactions;
        } else if (type === 'debit' && reason !== 'buy') {
          this.debitTransactions = transactions;
        } else if (type === 'debit' && reason === 'buy') {
          this.buyTransactions = transactions;
        } else {
          this.allTransactions = transactions;
        }
        this.allTransactions = this.allTransactions.filter(transaction => transaction.description !== 'Bottle Registeration');
        this.allTransactions = this.allTransactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'credit') );
        this.allTransactions = this.allTransactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'debit') );
        console.log('all transactions are ', this.allTransactions);
        this.creditTransactions = this.creditTransactions.filter(transaction => transaction.description !== 'Bottle Registeration');
        this.creditTransactions = this.creditTransactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'credit') );
        console.log('creditTransactions are ', this.creditTransactions);
        
        this.debitTransactions = this.debitTransactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'debit') );
        console.log('all transactions are ', this.allTransactions);

        /* transactions.map(transaction => {
          if (transaction.type == 'credit')
            this.totalCredit += transaction.amount;
        }); */
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
  }

  getUserCredit() {
    this.userService.getUser().subscribe(user => {
      this.totalCredit = user.credit;
    });
  }

  segmentChanged(event) {
    if (event.detail.value === 'credit' && !this.creditTransactions) {
      this.getTransactions('credit');
    } else if (event.detail.value === 'debit' && !this.debitTransactions) {
      this.getTransactions('debit');
    } else if (event.detail.value === 'refill' && !this.refillTransactions) {
      this.getTransactions('credit', 'refill');
    } else if (event.detail.value === 'buy' && !this.buyTransactions) {
      this.getTransactions('debit', 'buy');
    } else {
      this.getTransactions();
    }
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
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


  async viewTransactionDetails(id) {
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
}
