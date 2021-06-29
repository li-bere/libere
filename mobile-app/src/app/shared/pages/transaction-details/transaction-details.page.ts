import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TransactionI } from '@app/core/models/transaction';
import { ToastService } from '@app/core/services/toast.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { UserService } from '@app/core/services/user.service';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {

  @Input() transactionId: string;

  // parentMessage: any;

  loading = false;

  transaction: TransactionI;
  currentUserId: any;

  constructor(
    private modalController: ModalController,
    private toastService: ToastService,
    private transactionService: TransactionService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {

  }

  ngOnInit() {
    this.loading = true;
    // this.loadingService.presentLoading('');
    this.transactionService.getTransaction(this.transactionId).subscribe((transaction: TransactionI) => {
      this.currentUserId = this.authService.currentUserId;
      console.log(transaction);
      this.transaction = transaction;
      // this.parentMessage = this.transactionId;
      this.loading = false;
      // this.loadingService.dismissLoader();
    }, error => {
      this.loading = false;
      // this.loadingService.dismissLoader();
      console.error(error);
      this.toastService.presentToast(error.message);
    });
  }

  // ngAfterViewInit() {
  //   this.loading = true;
  //   this.transactionService.getTransaction(this.transactionId).subscribe((transaction: TransactionI) => {
  //     this.currentUserId = this.authService.currentUserId;
  //     console.log(transaction);
  //     this.transaction = transaction;
  //     this.loading = false;
  //   }, error => {
  //     this.loading = false;
  //     console.error(error);
  //     this.toastService.presentToast(error.message);
  //   });
  // }

  getDateObj(date) {
    // console.log(date);
    return date.toDate();
  }

  back() {
    this.modalController.dismiss(null);
  }

  viewUser(userId) {
    console.log(userId);
    this.router.navigate(['/profile'], { queryParams: { id: userId } });
    this.back();
  }

  viewShop(shopId) {
    console.log(shopId);
    this.router.navigate(['./view-shop'], { queryParams: { id: shopId } });
    this.back();
  }

}
