import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TransactionsListComponent } from "./transactions-list/transactions-list.component";
import { ViewTransactionComponent } from "./view-transaction/view-transaction.component";

const routes: Routes = [
  {
    path: "",
    component: TransactionsListComponent,
  },
  {
    path: "view-transaction",
    component: ViewTransactionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
