import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions.routing';

import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';



@NgModule({
  declarations: [TransactionsListComponent, ViewTransactionComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule
  ]
})
export class TransactionsModule { }
