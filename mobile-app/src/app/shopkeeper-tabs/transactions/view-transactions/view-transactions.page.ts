import { Component, Input, OnInit } from '@angular/core';
import { TransactionService } from '@app/core/services/transaction.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.page.html',
  styleUrls: ['./view-transactions.page.scss'],
})
export class ViewTransactionsPage implements OnInit {
  @Input() transaction: any;
  transactionData: any;

  constructor(private modalCtrl: ModalController,
              private transactionService: TransactionService) { }

  ngOnInit() {
    this.transactionService.getTransaction(this.transaction).subscribe(result => {
      console.log(result);
      this.transactionData = result;
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
