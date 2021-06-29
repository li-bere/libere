import { UserI } from './../../core/models/user';

import { ModalController, Platform } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { TransactionI } from '@app/core/models/transaction';
import { TransactionStatus } from '@app/core/constants/transaction-status';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/core/services/user.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { TransactionDetailsPage } from '@app/shared/pages/transaction-details/transaction-details.page';
import { DirectionsService } from '@app/core/services/directions.service';
import { AuthService } from '@app/core/services/auth.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit, OnDestroy {
  type: 'all' | 'credit' | 'debit' | 'refill' | 'buy' = 'all';
  loading = false;
  allTransactions: Array<TransactionI>;
  alllTransactions: Array<TransactionI>;
  creditTransactions: Array<TransactionI>;
  debitTransactions: Array<TransactionI>;
  refillTransactions: Array<TransactionI>;
  totalCredit = 0;
  paramsSub: any;
  transactionStatus = TransactionStatus;
  transactionData: any;
  emailVerified= false;
  
  constructor(
    private router: Router,
    private platform: Platform,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private toastService: ToastService,
    private userService: UserService,
    private transactionService: TransactionService,
    private directionService: DirectionsService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.currentUserObservable.subscribe((firebaseUser) => {

     
      console.log('transaction page');
      if (firebaseUser.emailVerified) {
        this.emailVerified=true;
      }
    });
    // this.userService.getUser().subscribe((res: UserI)=>{
    //   if(res.roles.user){
    //     this.role=false;
    //   }
    //   else{
    //     this.role=true;
    //   }
    // })
    this.getUserCredit();
    const state = this.route.paramMap.pipe(map(() => window.history.state));
    this.paramsSub = state.subscribe(stateData => {
      if (stateData.type) {
        this.type = stateData.type;
        const type = stateData.type && stateData.type === 'refill' ? 'debit' : stateData.type;
        const reason = stateData.reason ? stateData.reason : null;
        this.getTransactions(type, reason);
      } else{
        console.log('getting transactions');
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
    // this.totalCredit = 0;
   this.transactionService.getTransactions(type, reason).subscribe(
      (transactions: Array<TransactionI>) => {
        console.log(transactions);
        this.transactionData = transactions;
        console.log(this.transactionData);
        if (type === 'credit') {
          this.creditTransactions = transactions;
        } else if (type === 'debit' && reason !== 'refill') {
          this.debitTransactions = transactions;
        } else if (type === 'debit' && reason === 'refill') {
          this.refillTransactions = transactions;
        } else {
          this.allTransactions = transactions;
        }
        this.loading=false;
        
          this.allTransactions = this.allTransactions.filter(transaction => transaction.description !== 'Shop Creation');
        this.allTransactions = this.allTransactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'debit') );
        this.allTransactions = this.allTransactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'credit') );
        console.log('all transactions are ', this.allTransactions);
        
          this.creditTransactions = this.creditTransactions.filter(transaction => transaction.description !== 'Shop Creation');
        this.creditTransactions = this.creditTransactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'debit') );
        this.creditTransactions = this.creditTransactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'credit') );
        console.log('creditTransactions are ', this.creditTransactions);
        
        
          this.debitTransactions = this.debitTransactions.filter(transaction => transaction.description !== 'Shop Creation');
          this.debitTransactions = this.debitTransactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'debit') );
          this.debitTransactions = this.debitTransactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'credit') );
          console.log('debitTransactions are ', this.debitTransactions);
  
      
        
               // this.refillTransactions = this.refillTransactions.filter(transaction => transaction.description !== 'Shop Creation');
        // this.refillTransactions = this.refillTransactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'debit') );
      
          this.refillTransactions = this.refillTransactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'credit') );
        console.log('refillTransactions are ', this.refillTransactions);
      
        
        
        
        
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
      console.log(user);
      this.totalCredit = user.credit;
    });
  }
  segmentChanged(event) {
    if (event.detail.value === 'credit' && !this.creditTransactions) {
      this.getTransactions('credit');
    } else if (event.detail.value === 'debit' && !this.debitTransactions) {
      this.getTransactions('debit');
    } else if (event.detail.value === 'refill' && !this.refillTransactions) {
      this.getTransactions('debit', 'refill');
    } else {
      this.getTransactions(event);
    }
  }
  getDirections(event , shopId) {
    console.log(shopId);
    event.stopPropagation();
    this.directionService.getDirections(shopId);
    

    // this.modalController.dismiss();
  }
  async viewTransactionDetails(id) {
    console.log(id);
    console.log(id, "id is");
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
  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
