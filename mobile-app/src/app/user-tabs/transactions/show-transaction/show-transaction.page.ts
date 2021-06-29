import { Component, Input, OnInit } from '@angular/core';
import { TransactionService } from '@app/core/services/transaction.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-transaction',
  templateUrl: './show-transaction.page.html',
  styleUrls: ['./show-transaction.page.scss'],
})
export class ShowTransactionPage implements OnInit {

  @Input() transaction: any;
  transactionData: any;
  constructor(private transactionService: TransactionService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.transactionService.getTransaction(this.transaction).subscribe(res => {
      console.log(res);
      this.transactionData = res;
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

 



}
