import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewShopPage } from './view-shop.page';

const routes: Routes = [
  {
    path: '',
    component: ViewShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewShopPageRoutingModule {}
