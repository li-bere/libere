import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopTransactionsPage } from './shop-transactions.page';

const routes: Routes = [
  {
    path: '',
    component: ShopTransactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopTransactionsPageRoutingModule {}
