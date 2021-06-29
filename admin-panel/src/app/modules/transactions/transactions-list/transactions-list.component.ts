import { Component, OnInit } from "@angular/core";

import { TransactionI } from "./../../../core/models/transaction";

import { TransactionsService } from "./../../../core/services/transactions/transactions.service";

@Component({
  selector: "app-transactions-list",
  templateUrl: "./transactions-list.component.html",
  styleUrls: ["./transactions-list.component.css"],
})
export class TransactionsListComponent implements OnInit {
  loadingSpinner: boolean = true;
  transactions: Array<TransactionI> = [];

  constructor(
    private transactionsService: TransactionsService,
  ) {}

  ngOnInit(): void {
    this.transactionsService.getTransactions().subscribe((res) => {
      console.log(res);
      this.transactions = res;
      this.loadingSpinner = false;
    });
  }
}
