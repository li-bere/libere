import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowTransactionPage } from './show-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: ShowTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowTransactionPageRoutingModule {}
