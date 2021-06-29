import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { TransactionI } from "./../../../core/models/transaction";

import { TransactionsService } from "./../../../core/services/transactions/transactions.service";

@Component({
  selector: "app-view-transaction",
  templateUrl: "./view-transaction.component.html",
  styleUrls: ["./view-transaction.component.css"],
})
export class ViewTransactionComponent implements OnInit {
  loadingSpinner: boolean = true;
  transaction: TransactionI;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.transactionsService
        .getTransaction(params["id"])
        .subscribe((res: TransactionI) => {
          console.log(res);
          this.transaction = res;
          this.loadingSpinner = false;
        });
    });
  }
}
